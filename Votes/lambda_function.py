# Payload exemple : POST
# {
#     "email": "hello@example.com",
# }

import boto3
import sendgrid
import random
import os
import re
from sendgrid.helpers.mail import Mail

# DynamoDB Configuration
dynamodb = boto3.resource('dynamodb')
table_name = "Votes"  # Remplace par le nom exact de ta table DynamoDB
table = dynamodb.Table(table_name)

def is_valid_email(email):
    """Vérifie si une adresse email est valide."""
    email_regex = r"(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)"
    return re.match(email_regex, email) is not None

def email_exists(email):
    """Vérifie si l'email existe déjà dans DynamoDB."""
    try:
        response = table.get_item(Key={"email": email})
        return "Item" in response
    except Exception as e:
        raise Exception(f"Erreur lors de la vérification de l'email dans DynamoDB : {str(e)}")

def generate_code(length=6):
    """Génère un code aléatoire de chiffres."""
    return ''.join(random.choices("0123456789", k=length))

def lambda_handler(event, context):
    # Récupérer les données du formulaire
    try:
        recipient_email = event["email"]
    except KeyError:
        return {"statusCode": 400, "body": "Erreur : Veuillez fournir une adresse e-mail."}

    # Validation de l'adresse email
    if not is_valid_email(recipient_email):
        return {"statusCode": 400, "body": "Erreur : L'adresse e-mail fournie n'est pas valide."}

    # Vérifier si l'email existe déjà dans DynamoDB
    try:
        if email_exists(recipient_email):
            return {"statusCode": 400, "body": "Erreur : Cet e-mail a déjà un code associé."}
    except Exception as e:
        return {"statusCode": 500, "body": str(e)}

    # Générer le code et l'enregistrer dans DynamoDB
    code = generate_code()
    try:
        table.put_item(
            Item={
                "email": recipient_email,
                "code": code,
                "used": False  # Champ supplémentaire pour marquer le code comme utilisé ou non
            }
        )
    except Exception as e:
        return {"statusCode": 500, "body": f"Erreur DynamoDB : {str(e)}"}

    # Envoyer le mail avec SendGrid
    try:
        sg = sendgrid.SendGridAPIClient(api_key=os.environ.get("SENDGRID_API_KEY"))
        email_content = f"""
        <html>
            <body>
                <h1>Votre code de vote</h1>
                <p>Bonjour,</p>
                <p>Voici votre code de vote d'electionAWS :</p>
                <h2 style="color:blue;">{code}</h2>
                <p>Veuillez l'utiliser pour voter pour l'un des candidats !</p>
                <p>Cordialement,</p>
                <p>L'équipe DAS</p>
            </body>
        </html>
        """
        email = Mail(
            from_email="rahim.hayat@etudiant.univ-reims.fr",  # Adresse d'expéditeur vérifiée
            to_emails=recipient_email,
            subject="Votre code de vérification",
            html_content=email_content
        )
        response = sg.send(email)

        return {
            "statusCode": response.status_code,
            "body": f"E-mail envoyé avec succès à {recipient_email}."
        }
    except Exception as e:
        return {"statusCode": 500, "body": f"Erreur SendGrid : {str(e)}"}
