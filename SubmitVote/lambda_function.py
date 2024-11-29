# Payload exemple : POST
# {
#     "code": "123456",
#     "candidate_id": "1"
# }

import boto3
from boto3.dynamodb.conditions import Key

# DynamoDB Configuration
dynamodb = boto3.resource('dynamodb')
votes_table = dynamodb.Table("Votes")
candidates_table = dynamodb.Table("Candidates")

def lambda_handler(event, context):
    try:
        # Récupérer les données du formulaire
        code = event["code"]
        candidate_id = event["candidate_id"]
    except KeyError:
        return {"statusCode": 400, "body": "Erreur : Données manquantes dans la requête."}

    # Étape 1 : Vérifier si le code existe et récupérer l'email
    try:
        response = votes_table.query(
            IndexName="code-index",  # Utilise l'index secondaire
            KeyConditionExpression=Key("code").eq(code)
        )
        items = response.get("Items", [])
        
        # Si aucun élément trouvé
        if not items:
            return {"statusCode": 404, "body": "Erreur : Le code n'existe pas."}

        # Récupère l'entrée associée
        vote_entry = items[0]

        # Vérifie si le code a déjà été utilisé
        if vote_entry.get("used", False):
            return {"statusCode": 403, "body": "Erreur : Ce code a déjà été utilisé."}

        # Récupère l'email pour l'opération de mise à jour
        email = vote_entry["email"]
    except Exception as e:
        return {"statusCode": 500, "body": f"Erreur DynamoDB Votes : {str(e)}"}

    # Étape 2 : Récupérer le nom du candidat
    try:
        candidate_response = candidates_table.get_item(
            Key={"id": candidate_id}  # Clé primaire de la table Candidates
        )
        candidate_item = candidate_response.get("Item")
        
        # Si le candidat n'est pas trouvé
        if not candidate_item:
            return {"statusCode": 404, "body": "Erreur : Candidat non trouvé."}
        
        candidate_name = candidate_item["name"]
    except Exception as e:
        return {"statusCode": 500, "body": f"Erreur DynamoDB Candidates : {str(e)}"}

    # Étape 3 : Mettre à jour voteCount dans la table Candidates
    try:
        candidates_table.update_item(
            Key={"id": candidate_id},  # Clé primaire de la table Candidates
            UpdateExpression="SET voteCount = if_not_exists(voteCount, :start) + :inc",
            ExpressionAttributeValues={
                ":inc": 1,
                ":start": 0
            },
            ReturnValues="UPDATED_NEW"
        )
    except Exception as e:
        return {"statusCode": 500, "body": f"Erreur DynamoDB Candidates : {str(e)}"}

    # Étape 4 : Marquer le code comme utilisé dans la table Votes
    try:
        votes_table.update_item(
            Key={"email": email},  # Utilise l'email comme clé primaire
            UpdateExpression="SET used = :used",
            ExpressionAttributeValues={":used": True}
        )
    except Exception as e:
        return {"statusCode": 500, "body": f"Erreur DynamoDB Votes (update): {str(e)}"}

    # Succès
    return {
        "statusCode": 200,
        "body": f"Le vote pour le candidat {candidate_name} a été enregistré avec succès."
    }
