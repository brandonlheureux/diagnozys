# Diagnozys Patient Api - v1

| Endpoint                                              | Method | Query       | Params                         | Body                                                        | Description                                                           |
| ----------------------------------------------------- | ------ | ----------- | ------------------------------ | ----------------------------------------------------------- | --------------------------------------------------------------------- |
| Requires authentication                               |
| `/patient/completeProfile`                            | POST   |             |                                | firstName, lastName, dateOfBirth, weight, height, race, sex | Updates base user document to complete profile                        |
| Rrequires authentication & completed profile          |
| `/patient/medicalReports/generateReport`              | GET    |             | 1:diagnosisType, 2:diagnosisId |                                                             | Creates a medical report using user's profile and requested diagnosis |
| `/patient/medicalReports`                             | GET    |             | 1:reportId                     |                                                             | Returns a user's specifc medical report                               |
| `/patient/diagnosis/types`                            | GET    |             |                                |                                                             | Returns available diagnosis types                                     |
| `/patient/diagnosis/skin-lesions/newDiagnosis`        | GET    |             |                                |                                                             | Creates a new diagnosis request, creating an db entry                 |
| `/patient/diagnosis/skin-lesions/allDiagnosisResults` | GET    | skip, limit |                                |                                                             | Returns current user's paginated skin lesion diagnosis results        |
| `/patient/diagnosis/skin-lesions/diagnosisResult`     | GET    |             |                                |                                                             | Returns diagnosis result of a skin lesion request                     |
| `/patient/diagnosis/upload/skin-lesion-upload-url`    | GET    |             | 1:skinLesionDiagnosisId        |                                                             | Returns a signed s3 url for image upload, linked to a diagnosis by id |
| `/patient/profile`                                    | GET    |             |                                |                                                             | Returns current user's profile                                        |
| `/patient/profile`                                    | PUT    |             |                                | firstName, lastName, dateOfBirth, weight, height, race, sex | Updates current user's profile                                        |

## external resources:

| name                          | description                                     | used for                                                                   |
| ----------------------------- | ----------------------------------------------- | -------------------------------------------------------------------------- |
| aws rekog                     | image recognition as a service                  | detecting skin lesion diseases                                             |
| aws s3                        | cloud bucket storage                            | uploading & storing images for rekog processing & fetching                 |
| aws cloudformation            | cloud stack building service                    | applying a batch processing model for image recognition                    |
| aws batch processing template | template found in the aws github                | comes with preconfigured lambdas, event queues, s3 buckets & step function |
| aws lambda                    | cloud functions                                 | updating diagnosis results in mongoDB atlas database                       |
| firebase hosting              | hosting for static assets                       | hosting react apps (patient dashboard)                                     |
| firebase functions            | cloud functions                                 | hosting express server                                                     |
| google domains                | domain name registrar                           | registering diagnozys.com & diagnozys.ca, creating subdomains              |
| auth0                         | authentication & authorization service provider | authenticating , authorizing, & RBAC                                       |
| mongodb atlas                 | NoSQL database                                  | general storage for web app                                                |

### More info on aws decisions:

This web app needed to be scalable and as cheap as possible. Running a image rekog model 24/7 would be very expensive at 4$/h, even for dev use. The model would be sitting idle most of the time.

model: https://github.com/aws-samples/amazon-rekognition-custom-labels-batch-processing => 
A batch processing model needed to be used in order to reduce the cost down to 0$ for this project. This allows very little idling the recognition model, in short & controlled bursts on a schedule. Currently set to mondays and thursdays at 14:00 Eastern. Modifications were made to the cloudFormation stack to reduce costs, mainly the cron job & image recognition uptime in the step function.

The image uploading might have caused issues as well. To limit attacks or infinite loops, a limit was imposed on uploads. A user may only request a diagnosis image upload "signed aws s3 url" once per diagnosis request. An upgraded protection would be to introduce rate limiting or quota limits.

GCP also offers image recognition, but would have cost > 30$ just for model training.

### authorization:

All endpoints have been protected using auth0 issued JWTs. With RBAC enabled, this allows endpoints to target specifc permissions and apply api access control.

### auth0:

Custom actions (rules) were added:

- assign a role to user based on which dashboard sign up a user redirects from
- create new mongodb user profile on auth0 sign up
