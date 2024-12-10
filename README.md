<div align="center">

   <h1 align="center">Welcome to ElectionAWS! 🗳️</h1>

   <br />
   <img src="https://i.ibb.co/ZxFJwRF/banner-vote-aws.png" alt="Project Banner">
   <br/><br/>

   <div>
      <img src="https://img.shields.io/badge/-Python-black?style=for-the-badge&logoColor=white&logo=python&color=3776AB" alt="Python" />
      <img src="https://img.shields.io/badge/-AWS-black?style=for-the-badge&logoColor=white&logo=amazonaws&color=FF9900" alt="AWS" />
      <img src="https://img.shields.io/badge/-Lambda-black?style=for-the-badge&logoColor=white&logo=awslambda&color=FF6347" alt="Lambda" />
      <img src="https://img.shields.io/badge/-API%20Gateway-black?style=for-the-badge&logoColor=white&logo=amazonaws&color=8A2BE2" alt="API Gateway" />
      <img src="https://img.shields.io/badge/-IAM-black?style=for-the-badge&logoColor=white&logo=amazonaws&color=4B0082" alt="IAM" />
      <img src="https://img.shields.io/badge/-S3-black?style=for-the-badge&logoColor=white&logo=amazons3&color=32CD32" alt="S3" />
      <img src="https://img.shields.io/badge/-DynamoDB-black?style=for-the-badge&logoColor=white&logo=amazondynamodb&color=4682B4" alt="DynamoDB" />
      <img src="https://img.shields.io/badge/-Boto3-black?style=for-the-badge&logoColor=white&logo=python&color=FFD700" alt="Boto3" />
   </div>

   <h3 align="center">"A simple and efficient voting system powered by AWS."</h3>

ElectionAWS is a secure voting platform built with leveraging AWS services such as DynamoDB, Lambda using Python, and S3 for scalability and reliability. Designed for transparency and efficiency, it ensures secure vote storage and real-time result retrieval.

</div>

## Table of Contents

- [⚙️ Tech Stack](#tech-stack)
- [🔋 Features](#features)
- [🖼️ Preview](#preview)
- [🚀 Getting Started](#getting-started)
- [📜 Environment Variables](#environment-variables)
- [🔗 Links](#links)

## <a name="tech-stack">⚙️ Tech Stack</a>

ElectionAWS leverages modern technologies to deliver a secure and efficient voting system:

- **Python**: Core programming language for backend logic.
- **AWS Lambda**: Serverless functions for real-time processing of votes.
- **AWS API Gateway**: Scalable gateway to expose APIs securely.
- **AWS S3**: Secure file storage for static content and backups.
- **AWS DynamoDB**: NoSQL database for reliable vote storage.
- **AWS IAM**: Manage permissions and secure AWS resources.
- **Boto3**: AWS SDK for Python to interact with AWS services.

## <a name="features">🔋 Features</a>

- **Serverless architecture**:
  - Use of AWS Lambda for on-demand backend operations.
  - Scalable API management with AWS API Gateway.
- **Secure vote storage**:
  - DynamoDB ensures highly available, fast storage.
  - Data encryption and permission management with IAM.
- **Efficient data access**:
  - S3 for hosting backups and static content.
  - Integrated with Boto3 for seamless AWS interactions.
- **Scalability and reliability**:
  - Cloud-based architecture ensures consistent performance.

## <a name="preview">🖼️ Preview</a>

<div align="center">
   <img src="https://i.ibb.co/vsGLsyN/election-AWS.png" alt="ElectionAWS Site Preview" width="100%" />
</div>

## <a name="getting-started">🚀 Getting Started</a>

### 1. Clone the repository

```bash
git clone https://github.com/Rahim21/electionAWS.git
cd electionAWS
```

### 3. Configure the environment variables

Before running the server, set up your AWS credentials and other environment variables. See the [Environment Variables section](#environment-variables) for details.

### 4. Deploy to AWS Lambda (optional)

For deployment, package the project and deploy it to AWS Lambda using the AWS CLI or SAM (Serverless Application Model).

## <a name="environment-variables">📜 Environment Variables</a>

To set up your script, copy the `.env.example` file to create a `.env` file in the project root by typing:

```bash
cp .env.example .env.local
```

add the following variables into the `.env`file :

```bash
REACT_APP_API_URL=your_aws_api_url
```

Ensure you replace `your_aws_api_url` values with your actual AWS credentials.

## <a name="links">🔗 Links</a>

- [AWS DynamoDB Documentation](https://docs.aws.amazon.com/dynamodb/)
- [Boto3 Documentation](https://boto3.amazonaws.com/v1/documentation/api/latest/index.html)

---

## 👇 Find me on GitHub!

<div align="center">
    <h4>Built with ❤️ and AWS</h4>
  <img src="https://i.ibb.co/CvgBS4n/Rahim21-github-banner.png" alt="Rahim21 GitHub Banner" width="100%" />
</div>
