# Diagnozys
Medical Image-Based Diagnosis Web Application Prototype.

View live app at https://diagnozys.com

### Description
The goal of this project was to fully dive into backend development using a cloud provider, and explore the world of machine learning / neural networks.
AWS was used as it had lower operation costs than GCP & Azure & no upfront training costs. In order to remain in the free tier, the image recognition service is run twice a week for 5 min, increasing on demand. A "batch rekog" template was used and tweaked. You can view the original here: https://github.com/aws-samples/amazon-rekognition-custom-labels-batch-processing

Firebase functions & hosting was used to host the business logic / backend api and frontend. Had google cloud been cheaper to use, most of this project would have been hosted on GCP. 

MongoDB atlas was used as the main application database, sotring references and results. All images are stored in an aws s3 bucket and only delivered to the client through pre-signed access links. The api will only grant access links to valid JWT holders, given by the Auth0 authentication service.

This project was to be split in 3 apps, only the patient dashboard was implemented in the 2 week timeframe we were allotted. The set goal was accomplished, the remainder of this project may or may not be completed. 

- diagnozys => landing page, public  ❌
- app.diagnozys => patient dashboard ✅ 
- practitioner.diagnozys => practitioner dashboard ❌
