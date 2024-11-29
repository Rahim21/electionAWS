# Payload exemple : GET

import json
import boto3
from decimal import Decimal

# Initialisation du client DynamoDB
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Candidates')

def decimal_to_float(obj):
    """Convertit récursivement les objets Decimal en float"""
    if isinstance(obj, Decimal):
        return float(obj)
    elif isinstance(obj, list):
        return [decimal_to_float(i) for i in obj]
    elif isinstance(obj, dict):
        return {k: decimal_to_float(v) for k, v in obj.items()}
    return obj

def lambda_handler(event, context):
    # Récupère les candidats depuis DynamoDB
    response = table.scan()

    # Traite les résultats pour convertir les Decimal en float
    result = decimal_to_float(response['Items'])

    # Retourne les résultats sous forme de JSON
    return {
        'statusCode': 200,
        'body': json.dumps({'candidates': result})
    }