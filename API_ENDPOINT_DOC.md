Authentication System
Base Url: https://fastlearnersapp.com

Registration
Endpoint: POST /api/v1/register

Description: Register a new user with their email address.

Headers
Key	Value
Accept	application/json
Request Body
{
  "email": "john@example.com",
}
Redirection
Response	Redirect To
success	verify-email
validation error	none
user not found error	none
Success Response (200)
{
  "success" : true,
  "message": "A verification code has been sent to your registered email address.",
  "content":{},
  "code": 200,
}
Validation Error (422)
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": [
      "The email field is required."
    ]
  },
  "code": 422,
}
                        
User Exist Error (422)
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": [
      "The email has already been taken."
    ]
  },
  "code": 422
}
Verify Email After Registration
Endpoint: POST /api/v1/verify-email

Description: Verify email address after registration with a 6 digit code sent to the registered email address of the user which expires after 15 minutes.

Headers
Key	Value
Accept	application/json
Request Body
{
  "email": "john@example.com",
  "code": "849201"
}
Redirection
Response	Redirect To
success	create-password
validation error	none
code not found error	none
code expired error	none
Success Response (200)
{
  "success": true,
  "message": "Email verified successfully!",
  "content": {
    "access_token": "1|LyQYHtUKysAukDrUMQRHv2OoieEHlCKqQxpywRxy12146d17",
    "user": {
      "id": 1,
      "name": "John Doe",
      "username": "johndoe",
      "email": "john@example.com",
      "phone": "08012345678",
      "school": null,
      "class": null,
      "discipline": null,
      "date_of_birth": null,
      "country": null,
      "state": null,
      "city": null,
      "gender": null,
      "status": "active",
      "created_at": "2025-06-21T12:56:48.000000Z",
      "role": [
        "student"
      ]
    }
  },
  "code": 200
}
Validation Error (422)
{
  "success": false,
  "message": "Validation failed",
  "errors":{
    "email": [
      "The email field is required."
    ],
  "code": [
      "The code field is required."
    ],
  },
  "code": 422
}
Code Not Found Error (404)
{
  "success": false,
  "message": "Registration request not found!",
  "errors": null,
  "code": 404,
}
Invalid Code Error (400)
{
  "success": false,
  "message": "Invalid verification code!",
  "errors": null,
  "code": 400,
}
Code Expired Error (400)
{
  "success": false,
  "message": "Registration code has expired, try again!",
  "errors": null,
  "code": 400,
}
Create Password
Endpoint: POST /api/v1/create-password

Description: Create password after successfully verifying email address.

Headers
Key	Value
Authorization	Bearer {access_token}
Accept	application/json
Request Body
{
  "password": "password",
  "password_confirmation": "password",
}
Redirection
Response	Redirect To
success	set-role
validation error	none
Success Response (200)
{
  "success": true,
  "message": "Your password has been created successfully!",
  "content": {},
  "code": 200
}
Validation Error (422)
{
  "success": false,
  "message": "Validation failed",
  "errors":{
    "password": [
      "The password field is required.",
    ],
    "password": [
      "The password confirmation field is required.",
    ]
    "password": [
      "The password field confirmation does not match.",
    ]
  },
  "code": 422
}
Error Response (400)
{
  "success": false,
  "message": "An error occurred while creating your password, try again",
  "errors": null,
  "code": 400,
}
Set Role
Endpoint: POST /api/v1/set-role

Description: Set role after successfully creating password.

Note: User's are to select from ['guest','student','guardian']. If the user role selected is guardian, add extra input for child_email and child_phone

Headers
Key	Value
Authorization	Bearer {access_token}
Accept	application/json
Request Body
{
  "user_role": "student",

  "user_role": "guardian",
  "child_email": "child@example.com",
  "child_phone": "08098765432"
}
Redirection
Response	Redirect To
success	dashboard (redirect according to user's role)
validation error	none
Success Response (200)
{
  "success": true,
  "message": "Your role has been set successfully!",
  "content": {},
  "code": 200
}
Validation Error (422)
{
  "success": false,
  "message": "Validation failed",
  "errors":{
    "user_role": [
      "The user role field is required.",
    ],
  },
  "code": 422
}
Invalid Role Error (422)
{
  "success": false,
  "message": "Invalid role selected!",
  "errors": null,
  "code": 400
}
Error Response (400)
{
  "success": false,
  "message": "An error occurred while assigning role, try again",
  "errors": null,
  "code": 500,
}
Resend Verification Code
Endpoint: POST /api/v1/resend-verification-code

Description: Resend registration verification code in a case of delay or haven't received any.

Key	Value
Accept	application/json
Request Body
{
  "email": "john@example.com"
}
Redirection
Response	Redirect To
success	none
validation error	none
user not found error	none
error sending code	none
Success Response (200)
{
  "success": true,
  "message": "A verification code has been sent to your register email address.",
  "content": null,
  "code": 200,
}
Validation Error (422)
{
  "success": false,
  "message": "Validation failed.",
  "errors":{
    "email": [
      "The email field is required."
    ]
  }
  "code": 422,
}
User Not Found Error (404)
{
  "success": false,
  "message": "User not found.",
  "errors": null,
  "code": 404
}
Error Sending Code (500)
{
  "success": false,
  "message": "There was an error sending verification code, try again.",
  "errors": null,
  "code": 500
}
Login
Endpoint: POST /api/v1/login

Description: Login using email or phone and password. If user is inactive, a verification code will be sent to their email, else they'll be logged in and redirected to the dashboard.

Key	Value
Accept	application/json
Request Body
{
  "email_phone": "john@example.com",
  "password": "password"
}
Redirection
Response	Redirect To
success	dashboard (redirect according to user's role)
validation error	none
invalid login details error	none
inactive user error	verify-email
user suspended error	none
Success Response (200)
{
  "success": true,
  "message": "Email verified successfully!",
  "content": {
    "access_token": "1|LyQYHtUKysAukDrUMQRHv2OoieEHlCKqQxpywRxy12146d17",
    "user": {
      "id": 1,
      "name": "John Doe",
      "username": "johndoe",
      "email": "john@example.com",
      "phone": "08012345678",
      "school": null,
      "class": null,
      "discipline": null,
      "date_of_birth": null,
      "country": null,
      "state": null,
      "city": null,
      "gender": null,
      "status": "active",
      "created_at": "2025-06-21T12:56:48.000000Z",
      "role": [
        "student"
      ]
    }
  },
  "code": 200
}
Validation Error (422)
{
  "success": false,
  "message": "Validation failed!",
  "errors":{
    "email": [
      "The email field is required."
    ],
    "password": [
      "The password field is required."
    ],
  },
  "code": 422
}
Invalid Login Details Error (401)
{
  "success": false,
  "message": "Valid login details!",
  "error": null,
  "code": 401,
}
Inactive User Response (401)
{
  "success": false,
  "message": "Your account is not active. Please verify your account with the verification code sent to your email address",
  "error": null,
  "code": 401,
}
User Suspended Response (400)
{
  "success": false,
  "message": "Your account has been suspended, please contact support!",
  "error": null,
  "code": 400,
}
Login/Register With Google
Endpoint: POST /api/v1/google/redirect

Description: Login with a google account.

Headers
Key	Value
Accept	application/json
Request Body
{}
Redirection
Response	Redirect To
success	dashboard or create-password
validation error	none
Logout
Endpoint: POST /api/v1/logout

Description: Logs out an authenticated user.

Headers
Key	Value
Authorization	Bearer {access_token}
Accept	application/json
Redirection
Response	Redirect To
success	login
unauthorized error	none
Success Response (200)
{
  "success": true,
  "message": "Logged out successfully."
  "content": null,
  "code": 200,
}
Unauthorized (401)
{
  "success": false,
  "message": "Unauthorized."
  "errors": null,
  "code": 401,
}
Forgot Password
Endpoint: POST /api/v1/forgot-password

Description: Sends a 6-digit reset code to the user's email.

Key	Value
Accept	application/json
Request Body
{
  "email": "john@example.com"
}
Redirection
Response	Redirect To
success	verify reset code
validation error	none
email not found error	none
email sending error	none
Success Response (200)
{
  "success": true,
  "message": "Password reset code sent to your email!",
  "content": null,
  "code": 200,
}
Validation Error (422)
{
  "success": false,
  "message": "Validation failed.",
  "errors":{
    "email": [
      "The email field is required."
    ]
  },
  "code": 422,
}
Email Not Found Error (404)
{
  "success": false,
  "message": "Email not found.",
  "errors":{
      "email": [
        "This email address was not found on our record!"
      ]
  },
  "code": 404,
}
Verify Password Reset Code
Endpoint: POST /api/v1/verify-reset-code

Description: Verify a 6-digit reset code that was sent to a user's email.

Key	Value
Accept	application/json
Request Body
{
  "email": "john@example.com",
  "code": "849201",
}
Redirection
Response	Redirect To
success	reset password
validation error	none
code not found error	none
invalid code error	none
code expired error	none
Success Response (200)
{
  "success": true,
  "message": "Your code was verified, Create new password."
  "content": null,
  "code": 200,
}
Validation Error (422)
{
  "success": false,
  "message": "Validation failed."
  "errors":{
    "email": [
      "The email field is required."
    ],
    "code": [
      "The code field is required."
    ],
    "password": [
      "The password field is required."
    ],
    "password_confirmation": [
      "The password_confirmation field is required."
    ],
  }
  "code": 422,
}
Code Not Found Error (404)
{
  "success": false,
  "message": "Reset request was not found!"
  "errors": null,
  "code": 404,
}
Invalid Code Error (400)
{
  "success": false,
  "message": "Invalid reset code!"
  "errors": null,
  "code": 400,
}
Code Expired Error (400)
{
  "success": false,
  "message": "Reset request has expired, try again!"
  "errors": null,
  "code": 400,
}
Resend Password Reset Code
Endpoint: POST /api/v1/resend-reset-code

Description: resends a 6-digit reset code to the user's email.

Key	Value
Accept	application/json
Request Body
{
  "email": "john@example.com"
}
Redirection
Response	Redirect To
success	none
validation error	none
email not found error	none
email sending error	none
Success Response (200)
{
  "success": true,
  "message": "Password reset code sent to your email!",
  "content": null,
  "code": 200,
}
Validation Error (422)
{
  "success": false,
  "message": "Validation failed.",
  "errors":{
    "email": [
      "The email field is required."
    ]
  },
  "code": 422,
}
Email Not Found Error (404)
{
  "success": false,
  "message": "Email not found.",
  "errors":{
      "email": [
        "This email address was not found on our record!"
      ]
  },
  "code": 404,
}
Reset Password
Endpoint: POST /api/v1/reset-password

Description: Reset a users password

Key	Value
Accept	application/json
Request Body
{
  "email": "john@example.com",
  "password": "NewPass123",
  "password_confirmation": "NewPass123"
}
Redirection
Response	Redirect To
success	login
validation error	none
email not found error	none
email sending error	none
Success Response (200)
{
  "success": true,
  "message": "Your password has been reset successfully. You may now log in.",
  "content": null,
  "code": 200,
}
Validation Error (422)
{
  "success": false,
  "message": "Validation failed",
  "errors":{
    "email": [
      "The email field is required."
    ],
    "password": [
      "The password field is required."
    ],
    "password_confirmation": [
      "The password_confirmation field is required."
    ],
  }
  "code": 422
}
Code Not Found Error (404)
{
  "success": false,
  "message": "Reset code was not found!",
  "errors": null,
  "code": 404
}
Invalid Code Error (400)
{
  "success": false,
  "message": "Invalid reset code!",
  "errors": null,
  "code": 400
}
Code Expired Error (400)
{
  "success": false,
  "message": "Reset code has expired!",
  "error": null,
  "code": 400,
}

User Management
Base Url: https://fastlearnersapp.com

Profile Details
Endpoint: Get /api/v1/profile

Description: User's profile displays user's (all users i.e guest, student, guardian, admin etc) information.

Headers
Key	Value
Authorization	Bearer {access_token}
Accept	application/json
Success Response (200)
{
  "success": true,
  "message": "Your dashboard.",
  "content": {
    "user": {
      "id": 1,
      "name": null,
      "username": null,
      "email": "john@example.com",
      "phone": null,
      "school": null,
      "class": null,
      "discipline": null,
      "date_of_birth": null,
      "country": null,
      "state": null,
      "city": null,
      "gender": null,
      "status": "active",
      "created_at": "2025-06-21",
      "role": [
        "guest"
      ]
    }
  },
  "code": 200
}
Unauthorized Access
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}
Profile Page Data
Endpoint: Get /api/v1/profile/data

Description: Get user's profile data.

Headers
Key	Value
Authorization	Bearer {access_token}
Accept	application/json
Success Response (200)
{
  "success": true,
  "message": "Profile page data",
  "content": {
    "classes": [
      {
        "name": "JSS1"
      },
      {
        "name": "JSS2"
      },
      {
        "name": "JSS3"
      },
      {
        "name": "SSS1"
      },
      {
        "name": "SSS2"
      },
      {
        "name": "SSS3"
      }
    ],
    "roles": [
      "guest",
      "student",
      "guardian"
    ],
    "discipline": [
      {
        "name": "Art"
      },
      {
        "name": "Commercial"
      },
      {
        "name": "Science"
      }
    ]
  },
  "code": 200
}
Unauthorized Access
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}
Error Response
{
  "success": false,
  "message": "An error occurred while fetching profile page data, try again!",
  "errors": null,
  "code": 400,
}
Profile Edit
Endpoint: Post /api/v1/profile/edit

Description: Edit user profile information.
Notes:
=> If role is guardian, child_email and child_phone are also required. role options student,guest and guardian.
=> Show the role input field if user's role === "guest" else show a disabled input field. Users are to set their role to either student or guardian once.
=> Show the username input field if user's username == null else show a disabled input field. Users are to set their username once.
=> Show an enabled input field for date of birth input field if user's date_of_birth == null else show a disabled input field. Users are to set their date of birth once.
=> Show an enabled input field for class input field if user's class == null else show a disabled input field. Users are to set their class once.
=> Show an enabled input field for discipline input field if user's discipline == null WHEN user's class == SSS1 || SSS2 || SSS3 else show a disabled input field. Users are to set their discipline once.
=> Discipline (discipline) must be a select option of Art, Commercial and Science.
=> Show an enabled input field for gender input field if user's gender == null else show a disabled input field. Users are to set their gender once.
=> Show an enabled input field for date of birth input field if user's date of birth == null else show a disabled input field. Users are to set their date of birth once.
=> Note: Except for students, school, class and discipline are not required during profile edit for other roles (guest, guardian, teacher, admin, and superadmin)

Headers
Key	Value
Authorization	Bearer {access_token}
Accept	application/json
Request Body
{
  "name": "Linus Thompson",
  "username": "linus",
  "phone": "08012345678",
  "school": "Uyo High School",
  "class": "SS1",
  "discipline": "Science",,
  "date_of_birth": "03/11/2018",
  "gender": male,
  "country": Nigeria,
  "state": Akwa Ibom,
  "city": Uyo,
  "address": "123 Oron Road",

  "role": "guardian",
  "child_email": "child@example.com",
  "child_phone": "08098765432"
}
Redirection
Response	Redirect To
success	profile
validation error	none
unauthorized	login
Success Response (200)
{
  "success": true,
  "message": "Your profile has been updated successfully.",
  "content": {
    "user": {
      "id": 1,
      "name": "Linus Thompson",
      "username": "linus",
      "email": "john@example.com",
      "phone": "08012345678",
      "school": "Uyo High School",
      "class": "SS1",
      "discipline": "Science",
      "date_of_birth": "03/11/2018",
      "gender": male,
      "country": Nigeria,
      "state": Akwa Ibom,
      "city": Uyo,
      "address": "123 Oron Road"
      "status": "active",
      "created_at": "2025-06-21",
      "role": [
        "student"
      ]
    }
  },
  "code": 200,
}
Validation Error
{
  "success": false,
  "message": "Validation failed.",
  "errors":{
    "name": [
      "The name field is required."
    ],
    "username": [
      "The username field is required."
    ],
    "phone": [
      "The phone field is required."
    ],
    "school": [
      "The school field is required."
    ],
    "class": [
      "The class field is required."
    ],
    "discipline": [
      "The discipline field is required."
    ],
    "date_of_birth": [
      "The date of birth field is required."
    ],
    "gender": [
      "The gender is required for guardians."
    ],
    "country": [
      "The country is required for guardians."
    ],
    "state": [
      "The state field is required."
    ],
    "city": [
      "The city field is required."
    ],
    "address": [
      "The address field is required."
    ],
    "role": [
      "The role field is required."
    ],
    "child_email": [
      "Child Email is required for guardians."
    ],
    "child_phone": [
      "Child Phone is required for guardians."
    ]
  },
  "code": 422
}
Unauthorized Access
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}
Username Already Set Error
{
  "success": false,
  "message": "Username already updated and cannot be changed.",
  "errors": null,
  "code": 401,
}
Role Already Set Error
{
  "success": false,
  "message": "Role already updated and cannot be changed. For further enquiries, please contact our support team.",
  "errors": null,
  "code": 401,
}
Class Already Set Error
{
  "success": false,
  "message": "Class already updated. Make a request for class upgrade.",
  "errors": null,
  "code": 400,
}
Discipline Error if user class is JSS
{
  "success": false,
  "message": "You have to be in SSS class to choose a discipline!",
  "errors": null,
  "code": 400,
}
Discipline Already Set Error
{
  "success": false,
  "message": "Discipline already updated. For further enquiries, please contact our support team.",
  "errors": null,
  "code": 401,
}
Gender Already Set Error
{
  "success": false,
  "message": "Gender already updated. For further enquiries, please contact our support team.",
  "errors": null,
  "code": 401,
}
Date of birth Already Set Error
{
  "success": false,
  "message": "Date of birth already updated. For further enquiries, please contact our support team.",
  "errors": null,
  "code": 401,
}
Change Password
Endpoint: Get /api/v1/profile/edit/password

Description: Change user's password.

Headers
Key	Value
Authorization	Bearer {access_token}
Accept	application/json
Request Body
{
  "current_password": "password",
  "new_password": "newpassword",
  "new_password_confirmation": "newpassword",
}
Redirection
Response	Redirect To
success	profile
validation error	none
current password error	none
unauthorized	login
Success Response (200)
{
  "success": true,
  "message": "Your password has been changed successfully!",
  "content": null,
  "code": 200,
}
Validation Error (422)
{
  "success": false,
  "message": "validation failed!",
  "errors":{
    "current_password": [
      "The current_password field is required."
    ],
    "new_password": [
      "The new_password field is required."
    ],
    "new_password_confirmation": [
      "The new_password_confirmation field is required."
    ],
  },
  "code": 422
}
Current Password Error (422)
{
  "success": false,
  "message": "Your current password is incorrect!",
  "errors": null,
  "code": 422
}
Unauthorized Access
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}

Guest Management
Base Url: https://fastlearnersapp.com

Dashboard
Endpoint: Get /api/v1/guest

Description: Guest's dashboard overview.

Headers
Key	Value
Authorization	Bearer {access_token}
Accept	application/json
Success Response (200)
{
  "success": true,
  "message": "Your dashboard!",
  "content": {
    "data": '',
  },
  "code": 200
}
Unauthorized Access
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}
Error Message
{
  "success": false,
  "message": "Server error",
  "errors": null,
  "code": 500,
}

Student Management
Base Url: https://fastlearnersapp.com

Dashboard
Endpoint: Get /api/v1/dashboard

Description: User's dashboard overview and reports.

Headers
Key	Value
Authorization	Bearer {access_token}
Accept	application/json
Success Response (200)
{
  "success": true,
  "message": "Student information",
  "content": {
    "name": "Student User",
    "subjects": "",
    "lessons": "",
    "progress": {
      "subject": "Mathematics",
      "covered": 22,
      "left": 120
    },
    "quizzes": "",
    "subscription_status": "trial"
  },
  "code": 200
}
Unauthorized Access
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}
Error Message
{
  "success": false,
  "message": "Server error",
  "errors": null,
  "code": 500,
}

Student's Subject
Base Url: https://fastlearnersapp.com

List Student's Subjects
Endpoint: Get /api/v1/subjects

Description: Get the list of a student's subjects, compulsory selective subjects, compulsory selective subject status, selective subjects and selective subject status.

Note: => The compulsory selective subject status and selective subjects data is returned if the student is in a JSS class.

Headers
Key	Value
Authorization	Bearer {access_token}
Accept	application/json
Success Response (200)
{
  "success": true,
  "message": "Success",
  "content": {
    "subjects": [
      {
        "id": 1,
        "name": "General Mathematics"
      },
      {
        "id": 2,
        "name": "English Language"
      },
      {
        "id": 18,
        "name": "Civic Education"
      },
      {
        "id": 4,
        "name": "Biology"
      },
      {
        "id": 5,
        "name": "Physics"
      },
      {
        "id": 6,
        "name": "Chemistry"
      },
      {
        "id": 22,
        "name": "Christian Religious Studies"
      },
      {
        "id": 31,
        "name": "Efik"
      },
      {
        "id": 7,
        "name": "Further Mathematics"
      },
      {
        "id": 8,
        "name": "Economics"
      },
      {
        "id": 36,
        "name": "Computer Studies"
      }
    ],
    "compulsory_selective_status": "selected",
    "compulsory_selective": [
      {
        "id": 22,
        "name": "Christian Religious Studies"
      },
      {
        "id": 23,
        "name": "Islamic Religious Studies"
      },
      {
        "id": 24,
        "name": "Religious and Moral Education"
      }
    ],
    "selective_status": "selected",
    "selective": [
      {
        "id": 3,
        "name": "Agricultural Science"
      },
      {
        "id": 7,
        "name": "Further Mathematics"
      },
      {
        "id": 8,
        "name": "Economics"
      },
      {
        "id": 9,
        "name": "Geography"
      },
      {
        "id": 27,
        "name": "Yoruba"
      },
      {
        "id": 28,
        "name": "Hausa"
      },
      {
        "id": 29,
        "name": "Igbo"
      },
      {
        "id": 30,
        "name": "Ibibio"
      },
      {
        "id": 31,
        "name": "Efik"
      },
      {
        "id": 32,
        "name": "Obolo"
      },
      {
        "id": 35,
        "name": "Technical Drawing"
      },
      {
        "id": 36,
        "name": "Computer Studies"
      }
    ]
  },
  "code": 200
}
Unauthorized Access
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}
Update compulsory selective subject
Endpoint: Post /api/v1/subjects/update-compulsory-selective

Description: Updating compulsory selective subject is only applicable to JSS classes.

Note: => Under compulsory selective subject, a student is to select one (1) subject from the list of the religious studies.
=> Post the subject id in the request body.

Headers
Key	Value
Authorization	Bearer {access_token}
Accept	application/json
Request Body
{
  "subject": 22,
}
Redirection
Response	Redirect To
success	none
validation error	none
unauthorized	login
Success Response (200)
{
  "success": true,
  "message": "Compulsory Selective subject Updated successfully!",
  "content": null,
  "code": 200,
}
Unauthorized Access
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}
Error Response
{
  "success": false,
  "message": "Error updating compulsory selective subject, try again!",
  "errors": null,
  "code": 400,
}
Server Error Response
{
  "success": false,
  "message": "An error occurred while updating compulsory selective subject!",
  "errors": ["error messages"],
  "code": 500,
}
Update selective subject
Endpoint: Post /api/v1/subjects/update-selective

Description: Update a student's selective/discipline selective subjects.

Note: => Under selective (for JSS class) or discipline selective subjects (for SSS class), students are to select four (4) subjects from the list of subjects
=> Post the subject ids in the request body.

Headers
Key	Value
Authorization	Bearer {access_token}
Accept	application/json
Request Body
{
  "subjects[]": 31,
  "subjects[]": 7,
  "subjects[]": 8,
  "subjects[]": 36,
}
Redirection
Response	Redirect To
success	none
validation error	none
unauthorized	login
Success Response (200)
{
  "success": true,
  "message": "Selective subjects Updated successfully!",
  "content": null,
  "code": 200,
}
Unauthorized Access
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}
Server Error Response
{
  "success": false,
  "message": "An error occurred while updating selective subjects!",
  "errors": ["error messages"],
  "code": 500,
}

Student's Subject
Base Url: https://fastlearnersapp.com

Student's Subject
Endpoint: Get /api/v1/lessons/

Description: Get the list of a student's subjects (compulsory subject, compulsory selective, selective subjects.

Note: => The subject "slug" should be appended to the topics url to get the topics.

Headers
Key	Value
Authorization	Bearer {access_token}
Accept	application/json
Success Response (200)
{
  "success": true,
  "message": "Success",
  "content": {
    "subjects": [
      {
        "id": 1,
        "name": "General Mathematics",
        "slug": "general-mathematics"
      },
      {
        "id": 2,
        "name": "English Language",
        "slug": "english-language"
      },
      {
        "id": 18,
        "name": "Civic Education",
        "slug": "civic-education"
      },
      {
        "id": 4,
        "name": "Biology",
        "slug": "biology"
      },
      {
        "id": 5,
        "name": "Physics",
        "slug": "physics"
      },
      {
        "id": 6,
        "name": "Chemistry",
        "slug": "chemistry"
      },
      {
        "id": 22,
        "name": "Christian Religious Studies",
        "slug": "christian-religious-studies"
      },
      {
        "id": 31,
        "name": "Efik",
        "slug": "efik"
      },
      {
        "id": 7,
        "name": "Further Mathematics",
        "slug": "further-mathematics"
      },
      {
        "id": 8,
        "name": "Economics",
        "slug": "economics"
      },
      {
        "id": 36,
        "name": "Computer Studies",
        "slug": "computer-studies"
      }
    ]
  },
  "code": 200
}
Unauthorized Access
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}
User Class Not Found Error
{
  "success": false,
  "message": "User class not found!",
  "errors": null,
  "code": 404,
}
Server Error Response
{
  "success": false,
  "message": "There was an error fetching your subjects!",
  "errors": ["error messages"],
  "code": 500,
}

Topics
Base Url: https://fastlearnersapp.com

Get Topics
Endpoint: Get /api/v1/lessons/economics

Description: Get the list of topics of a subject

Note: => The subject "slug" should be appended to the overview url to get the lesson topic overview.

Headers
Key	Value
Authorization	Bearer {access_token}
Accept	application/json
Success Response (200)
{
  "success": true,
  "message": "Lesson topics!",
  "content": {
    "topics": {
      "first_term": [
        {
          "id": 1,
          "topic": "Meaning Of Economics And Related Concepts",
          "slug": "meaning-of-economics-and-related-concepts",
          "week": 1,
          "order_index": 1
        }
      ],
      "second_term": [
        {
          "id": 2,
          "topic": "Meaning Of Economics And Related Concepts",
          "slug": "meaning-of-economics-and-related-concepts",
          "week": 1,
          "order_index": 1
        }
      ],
      "third_term": [
        {
          "id": 3,
          "topic": "Meaning Of Economics And Related Concepts",
          "slug": "meaning-of-economics-and-related-concepts",
          "week": 1,
          "order_index": 1
        }
      ]
    }
  },
  "code": 200
}
Unauthorized Access
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}
Subject Not Found Error
{
  "success": false,
  "message": "Subject not found!",
  "errors": null,
  "code": 404,
}
Class Not Found Error
{
  "success": false,
  "message": "Error getting your class!",
  "errors": null,
  "code": 404,
}
Term Not Found Error
{
  "success": false,
  "message": "Error getting your term!",
  "errors": null,
  "code": 404,
}
Server Error Response
{
  "success": false,
  "message": "An error occurred while getting lesson topics!",
  "errors": ["error messages"],
  "code": 500,
}

Topics Overview
Base Url: https://fastlearnersapp.com

Get Topics Overview
Endpoint: Get /api/v1/lessons/economics/meaning-of-economics-and-related-concepts/overview

Description: Get the overview of a topic which comprises of Introduction, Concepts, Application, Summary and General Exercises.

Note: => For the concepts, it returns a count of the total number of the concept a lesson topic has, so you'll have to loop through the count. The count number will be appended to the concept url to display it specific content e.g lessons/economics/meaning-of-economics-and-related-concepts/concepts/1 for concept 1

Headers
Key	Value
Authorization	Bearer {access_token}
Accept	application/json
Success Response (200)
{
  "success": true,
  "message": "Success",
  "content": {
    "overview": {
      "introduction": "Introduction",
      "concepts_count": 3,
      "summary": "Summary",
      "application": "Application",
      "general_exercises": "General Exercises"
    }
  },
  "code": 200
}
Unauthorized Access
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}
Subject Not Found Error
{
  "success": false,
  "message": "Subject not found!",
  "errors": null,
  "code": 404,
}
Topic Not Found Error
{
  "success": false,
  "message": "Lesson topic not found!",
  "errors": null,
  "code": 404,
}
Server Error Response
{
  "success": false,
  "message": "An error occurred while getting lesson content: ",
  "errors": ["error messages"],
  "code": 500,
}

Lesson Content
Base Url: https://fastlearnersapp.com

Get Lesson Content
Endpoint: Get /api/v1/lessons/economics/meaning-of-economics-and-related-concepts/content

Description: Get the lesson content which includes the Introduction, Concepts, Application, Summary and General Exercises.

Headers
Key	Value
Authorization	Bearer {access_token}
Accept	application/json
Success Response (200)
{
  "success": true,
  "message": "Success",
  "content": {
    "lesson": {
      "id": 3,
      "class": "SSS1",
      "subject": "Economics",
      "term": "First",
      "week": 1,
      "topic": "Meaning Of Economics And Related Concepts",
      "overview": "Economics is the study of how individuals, firms, and governments allocate scarce resources to meet unlimited wants. This introductory lesson covers the definition of economics and clarifies basic economic concepts and terms, laying the foundation for further study in the subject.",
      "objectives": [
        {
          "description": "At the end of the lesson, students should understand the following concepts:",
          "points": [
            "The meaning and definitions of economics",
            "Basic economic concepts: scarcity, choice, scale of preference, opportunity cost",
            "The differences and importance of wants and needs"
          ]
        }
      ],
      "key_concepts": {
        "Definition of Economics": "Understanding economics as a social science and the major definitions given by scholars.",
        "Scarcity and Choice": "Explanation of limited resources versus unlimited wants and the need for making choices.",
        "Opportunity Cost": "The cost of forgoing the next best alternative when making decisions.",
        "Scale of Preference": "A list showing the arrangement of wants in order of importance."
      },
      "summary": "(i) Economics deals with the allocation of scarce resources.\n(ii) Definitions of economics vary among scholars but revolve around scarcity and choice.\n(iii) Key economic concepts include scarcity, opportunity cost, scale of preference, wants and needs.\n(iv) These concepts are foundational to understanding how individuals and societies manage resources.\n",
      "application": "Null",
      "video_path": null,
      "status": "active",
      "created_at": "24-09-2025",
      "updated_at": "24-09-2025",
      "concepts": [
        {
          "id": 22,
          "order_index": 1,
          "lesson_topic": "Meaning Of Economics And Related Concepts",
          "title": "The Meaning of Economics",
          "description": [
            {
              "heading": "The Meaning of Economics",
              "description": "Economics is a social science that studies how individuals and societies make decisions about the allocation of scarce resources. It addresses how people satisfy their unlimited wants using limited means.",
              "image_path": null,
              "points": []
            },
            {
              "heading": null,
              "description": "Adam Smith: 'Economics is an inquiry into the nature and causes of the wealth of nations.'",
              "image_path": null,
              "points": []
            },
            {
              "heading": null,
              "description": "Alfred Marshall: 'Economics is the study of man in the ordinary business of life.'",
              "image_path": null,
              "points": []
            },
            {
              "heading": null,
              "description": "Lionel Robbins: 'Economics is the science which studies human behavior as a relationship between ends and scarce means which have alternative uses.'",
              "image_path": null,
              "points": []
            }
          ],
          "created_at": "24-09-2025",
          "updated_at": "24-09-2025",
          "examples": [],
          "exercises": []
        },
        {
          "id": 23,
          "order_index": 2,
          "lesson_topic": "Meaning Of Economics And Related Concepts",
          "title": "Basic economic concepts: scarcity, choice, scale of preference, opportunity cost",
          "description": [
            {
              "heading": "Basic economic concepts: scarcity, choice, scale of preference, opportunity cost",
              "description": "The concepts of scarcity, choice, scale of preference, and opportunity cost are some of the most important ideas in economics. These ideas help us understand how people, families, and even governments make decisions about what to do with their money, time, and other resources. These concepts are like the foundation of the whole subject of economics. Once you understand them, other topics will become easier.",
              "Image_path": null,
              "points": []
            },
            {
              "heading": "Scarcity",
              "description": "This means that the resources we have (like money, time, land, labour) are limited, but our wants are unlimited.",
              "Image_path": null,
              "points": []
            },
            {
              "heading": "Choice",
              "description": "Because you cannot have everything, you must choose what to spend your money or time on.",
              "Image_path": null,
              "points": []
            },
            {
              "heading": "Scale of Preference",
              "description": "An individual’s list of wants arranged in order of importance.",
              "Image_path": null,
              "points": []
            },
            {
              "heading": "Opportunity Cost",
              "description": "The value of the next best alternative forgone. Whenever you make a choice, you’re giving up something else. The thing you give up is called the opportunity cost.",
              "Image_path": null,
              "points": []
            }
          ],
          "created_at": "24-09-2025",
          "updated_at": "24-09-2025",
          "examples": [],
          "exercises": []
        },
        {
          "id": 24,
          "order_index": 3,
          "lesson_topic": "Meaning Of Economics And Related Concepts",
          "title": "Needs and Wants",
          "description": [
            {
              "heading": "Needs and Wants",
              "description": "Needs are essential things required for survival, such as food, water, clothing, and shelter. Wants are non-essential desires or luxuries that make life more comfortable, like a smartphone, designer clothes, or vacations.",
              "image_path": "Differences between needs and wants",
              "points": null
            },
            {
              "heading": "Importance of distinguishing wants from needs",
              "description": null,
              "image_path": null,
              "points": [
                "Helps in wise allocation of limited resources",
                "Aids personal and national budgeting",
                "Encourages financial discipline",
                "Supports goal setting and prioritization"
              ]
            }
          ],
          "created_at": "24-09-2025",
          "updated_at": "24-09-2025",
          "examples": [],
          "exercises": []
        }
      ],
      "general_exercises": [],
      "check_markers": []
    }
  },
  "code": 200
}
Unauthorized Access
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}
Class Not Found Error
{
  "success": false,
  "message": "Class not found!",
  "errors": null,
  "code": 404,
}
Lesson Not Found Error
{
  "success": false,
  "message": "Lesson not found!",
  "errors": null,
  "code": 404,
}
Server Error Response
{
  "success": false,
  "message": "An error occurred while getting lesson content: ",
  "errors": ["error messages"],
  "code": 500,
}

Guardian Management
Base Url: https://fastlearnersapp.com

Dashboard
Endpoint: Get /api/v1/guardian

Description: Guardian's dashboard overview and reports.

Headers
Key	Value
Authorization	Bearer {access_token}
Accept	application/json
Success Response (200)
{
  "success": true,
  "message": "Your children's report and statistics",
  "content": {
    "children": 1,
    "report": null
  },
  "code": 200
}
Unauthorized Access
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}
Error Message
{
  "success": false,
  "message": "Server error",
  "errors": null,
  "code": 500,
}

All Lessons Upload
Base Url: https://fastlearnersapp.com

All In One Lesson Upload
Endpoint: Post /api/v1/superadmin/lessons/uploads/all-lesson-files

Description: All lesson files (lesson, concepts, examples, exercises, general-exercises, check-markers) upload.

Notes:
=> Uploaded file type should only be csv or txt.
Headers
Key	Value
Authorization	Bearer {access_token}
Accept	application/json
Request Body
{
  "lessons_file": "(binary-file)",
  "concepts_file": "(binary-file)",
  "examples_file": "(binary-file)",
  "exercises_file": "(binary-file)",
  "general_exercises_file": "(binary-file)",
  "check_markers_file": "(binary-file)",

}
Success Response (200)
{
  "success": true,
  "message": "All CSV files uploaded successfully.",
  "content": null,
  "code": 200
}
Validation Error
{
  "success": false,
  "message": "Validation failed.",
  "errors":{
    "lessons_file": [
      "The lessons file field is required."
    ],
    "concepts_file": [
      "The concepts file field is required."
    ],
    "examples_file": [
      "The school examples file is required."
    ],
    "exercises_file": [
      "The exercises file field is required."
    ],
    "general_exercises_file": [
      "The general exercises file field is required."
    ],
    "check_markers_file": [
      "The check markers file field is required."
    ]
  },
  "code": 422
}
Missing Column Error
{
  "success": false,
  "message": "Invalid (filename) CSV format. Missing column: (column name)",
  "errors": null,
  "code": 400,
}
Class Not Found Error
{
  "success": false,
  "message": "Class (class name) not found",
  "errors": null,
  "code": 404,
}
Subject Not Found Error
{
  "success": false,
  "message": "Subject (subject name) not found",
  "errors": null,
  "code": 404,
}
Term Not Found Error
{
  "success": false,
  "message": "Term (term name) not found",
  "errors": null,
  "code": 404,
}
Week Not Found Error
{
  "success": false,
  "message": "Week (week name) not found",
  "errors": null,
  "code": 404,
}
Lesson Not Found Error
{
  "success": false,
  "message": "Lesson (lesson topic) not found",
  "errors": null,
  "code": 404,
}
Concept Not Found Error
{
  "success": false,
  "message": "Concept (concept title) not found",
  "errors": null,
  "code": 404,
}
Upload Error
{
  "success": false,
  "message": "Error processing CSV files: (error message)",
  "errors": null,
  "code": 500,
}
Unauthorized Access
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}

Lessons Upload
Base Url: https://fastlearnersapp.com

Lessons Upload
Endpoint: Post /api/v1/superadmin/lessons/uploads/lessons

Description: Lessons files upload.

Notes:
=> Lessons file type should be csv or txt.
Headers
Key	Value
Authorization	Bearer {access_token}
Accept	application/json
Request Body
{
  "lessons_file": "(binary-file)"
}
Success Response (200)
{
  "success": true,
  "message": "Lessons uploaded successfully.",
  "content": null,
  "code": 200
}
Validation Error
{
  "success": false,
  "message": "Validation failed.",
  "errors":{
    "lessons_file": [
      "The lessons file field is required."
    ]
  },
  "code": 422
}
Missing Column Error
{
  "success": false,
  "message": "Invalid lesson CSV format. All columns are required.",
  "errors": null,
  "code": 400,
}
Class Not Found Error
{
  "success": false,
  "message": "Class (class name) not found",
  "errors": null,
  "code": 404,
}
Subject Not Found Error
{
  "success": false,
  "message": "Subject (subject name) not found",
  "errors": null,
  "code": 404,
}
Term Not Found Error
{
  "success": false,
  "message": "Term (term name) not found",
  "errors": null,
  "code": 404,
}
Week Not Found Error
{
  "success": false,
  "message": "Week (week name) not found",
  "errors": null,
  "code": 404,
}
Invalid JSON Format Error
{
  "success": false,
  "message": "Invalid JSON format in objectives or key_concepts",
  "errors": null,
  "code": 400,
}
Upload Error
{
  "success": false,
  "message": "Error uploading lessons: (error message)",
  "errors": null,
  "code": 500,
}
Unauthorized Access
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}

Concepts Upload
Base Url: https://fastlearnersapp.com

Concepts Upload
Endpoint: Post /api/v1/superadmin/lessons/uploads/concepts

Description: Concepts files upload.

Notes:
=> Concepts file type should be csv or txt.
Headers
Key	Value
Authorization	Bearer {access_token}
Accept	application/json
Request Body
{
  "concepts_file": "(binary-file)"
}
Success Response (200)
{
  "success": true,
  "message": "Lesson's concepts uploaded successfully.",
  "content": null,
  "code": 200
}
Validation Error
{
  "success": false,
  "message": "Validation failed.",
  "errors":{
    "concepts_file": [
      "The concepts file field is required."
    ]
  },
  "code": 422
}
Missing Column Error
{
  "success": false,
  "message": "Invalid concepts CSV format. All columns are required.",
  "errors": null,
  "code": 400,
}
Lesson Not Found Error
{
  "success": false,
  "message": "Lesson (lesson topic) not found",
  "errors": null,
  "code": 404,
}
Invalid JSON Format Error
{
  "success": false,
  "message": "Invalid JSON format in description",
  "errors": null,
  "code": 400,
}
Upload Error
{
  "success": false,
  "message": "Error uploading lesson's concept: (error message)",
  "errors": null,
  "code": 500,
}
Unauthorized Access
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}

Examples Upload
Base Url: https://fastlearnersapp.com

Examples Upload
Endpoint: Post /api/v1/superadmin/lessons/uploads/examples

Description: Examples files upload.

Notes:
=> Examples file type should be csv or txt.
Headers
Key	Value
Authorization	Bearer {access_token}
Accept	application/json
Request Body
{
  "examples_file": "(binary-file)"
}
Success Response (200)
{
  "success": true,
  "message": "Lesson's concepts examples uploaded successfully.",
  "content": null,
  "code": 200
}
Validation Error
{
  "success": false,
  "message": "Validation failed.",
  "errors":{
    "examples_file": [
      "The examples file field is required."
    ]
  },
  "code": 422
}
Missing Column Error
{
  "success": false,
  "message": "Invalid examples CSV format. All columns are required.",
  "errors": null,
  "code": 400,
}
Concept Not Found Error
{
  "success": false,
  "message": "Concept (concept title) not found",
  "errors": null,
  "code": 404,
}
Invalid JSON Format Error
{
  "success": false,
  "message": "Invalid JSON format in solution_steps",
  "errors": null,
  "code": 400,
}
Upload Error
{
  "success": false,
  "message": "Error uploading lesson's concepts examples: (error message)",
  "errors": null,
  "code": 500,
}
Unauthorized Access
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}

Exercises Upload
Base Url: https://fastlearnersapp.com

Exercises Upload
Endpoint: Post /api/v1/superadmin/lessons/uploads/exercises

Description: Exercises files upload.

Notes:
=> Exercises file type should be csv or txt.
Headers
Key	Value
Authorization	Bearer {access_token}
Accept	application/json
Request Body
{
  "exercises_file": "(binary-file)"
}
Success Response (200)
{
  "success": true,
  "message": "Lesson's concepts exercises uploaded successfully.",
  "content": null,
  "code": 200
}
Validation Error
{
  "success": false,
  "message": "Validation failed.",
  "errors":{
    "exercises_file": [
      "The exercises file field is required."
    ]
  },
  "code": 422
}
Missing Column Error
{
  "success": false,
  "message": "Invalid exercises CSV format. All columns are required.",
  "errors": null,
  "code": 400,
}
Concept Not Found Error
{
  "success": false,
  "message": "Concept (concept title) not found",
  "errors": null,
  "code": 404,
}
Invalid JSON Format Error
{
  "success": false,
  "message": "Invalid JSON format in solution_steps or answers",
  "errors": null,
  "code": 400,
}
Upload Error
{
  "success": false,
  "message": "Error uploading lesson's concepts exercises: (error message)",
  "errors": null,
  "code": 500,
}
Unauthorized Access
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}

General Exercises Upload
Base Url: https://fastlearnersapp.com

General Exercises Upload
Endpoint: Post /api/v1/superadmin/lessons/uploads/general-exercises

Description: General exercises files upload.

Notes:
=> General exercises file type should be csv or txt.
Headers
Key	Value
Authorization	Bearer {access_token}
Accept	application/json
Request Body
{
  "general_exercises_file": "(binary-file)"
}
Success Response (200)
{
  "success": true,
  "message": "General exercises uploaded successfully.",
  "content": null,
  "code": 200
}
Validation Error
{
  "success": false,
  "message": "Validation failed.",
  "errors":{
    "general_exercises_file": [
      "The general exercises file field is required."
    ]
  },
  "code": 422
}
Missing Column Error
{
  "success": false,
  "message": "Invalid general exercises CSV format. All columns are required.",
  "errors": null,
  "code": 400,
}
Lesson Not Found Error
{
  "success": false,
  "message": "Lesson (lesson topic) not found",
  "errors": null,
  "code": 404,
}
Invalid JSON Format Error
{
  "success": false,
  "message": "Invalid JSON format in solution_steps or answers",
  "errors": null,
  "code": 400,
}
Upload Error
{
  "success": false,
  "message": "Error uploading general exercises: (error message)",
  "errors": null,
  "code": 500,
}
Unauthorized Access
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}

Check Markers Upload
Base Url: https://fastlearnersapp.com

Check Markers Upload
Endpoint: Post /api/v1/superadmin/lessons/uploads/check-markers

Description: Check markers files upload.

Notes:
=> Check markers file type should be csv or txt.
Headers
Key	Value
Authorization	Bearer {access_token}
Accept	application/json
Request Body
{
  "check_marker_file": "(binary-file)"
}
Success Response (200)
{
  "success": true,
  "message": "Check markers uploaded successfully.",
  "content": null,
  "code": 200
}
Validation Error
{
  "success": false,
  "message": "Validation failed.",
  "errors":{
    "check_markers_file": [
      "The check markers file field is required."
    ]
  },
  "code": 422
}
Missing Column Error
{
  "success": false,
  "message": "Invalid check markers CSV format. All columns are required.",
  "errors": null,
  "code": 400,
}
Lesson Not Found Error
{
  "success": false,
  "message": "Lesson (lesson topic) not found",
  "errors": null,
  "code": 404,
}
Upload Error
{
  "success": false,
  "message": "Error uploading check markers: (error message)",
  "errors": null,
  "code": 500,
}
Unauthorized Access
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}

Scheme Of Work Upload
Base Url: https://fastlearnersapp.com

Scheme Of Work Upload
Endpoint: Post /api/v1/superadmin/lessons/uploads/scheme-of-work

Description: Scheme of work files upload.

Notes:
=> Scheme of work file type should be csv or txt.
Headers
Key	Value
Authorization	Bearer {access_token}
Accept	application/json
Request Body
{
  "scheme_of_work_file": "(binary-file)"
}
Success Response (200)
{
  "success": true,
  "message": "Scheme of work uploaded successfully.",
  "content": null,
  "code": 200
}
Validation Error
{
  "success": false,
  "message": "Validation failed.",
  "errors":{
    "scheme_of_work_file": [
      "The scheme of work file field is required."
    ]
  },
  "code": 422
}
Missing Column Error
{
  "success": false,
  "message": "Invalid scheme of work CSV format. All columns are required.",
  "errors": null,
  "code": 400,
}
Class Not Found Error
{
  "success": false,
  "message": "Class (class name) not found",
  "errors": null,
  "code": 404,
}
Subject Not Found Error
{
  "success": false,
  "message": "Subject (subject name) not found",
  "errors": null,
  "code": 404,
}
Term Not Found Error
{
  "success": false,
  "message": "Term (term name) not found",
  "errors": null,
  "code": 404,
}
Week Not Found Error
{
  "success": false,
  "message": "Week (week name) not found",
  "errors": null,
  "code": 404,
}
Invalid JSON Format Error
{
  "success": false,
  "message": "Invalid JSON format in breakdown",
  "errors": null,
  "code": 400,
}
Upload Error
{
  "success": false,
  "message": "Error uploading scheme of work: (error message)",
  "errors": null,
  "code": 500,
}
Unauthorized Access
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}

Get Lessons
Base Url: https://fastlearnersapp.com

Get Classes, Subjects, Terms And Weeks
Endpoint: Get /api/v1/superadmin/lessons/get-classes-subjects-terms-weeks

Description: Get classes, subjects, terms and week to query lessons according to class, subject, term and week.

Note: To get lessons you've to classes, subjects, terms and week to query lessons according to class, subject, term and week.

Headers
Key	Value
Authorization	Bearer {access_token}
Accept	application/json
Redirection
Response	Redirect To
success	none
validation error	none
unauthorized	login
Success Response (200)
{
  "success": true,
  "message": "Success",
  "content": {
    "classes": [
      {
        "id": 1,
        "name": "JSS1"
      },
      {
        "id": 2,
        "name": "JSS2"
      },
      {
        "id": 3,
        "name": "JSS3"
      },
      {
        "id": 4,
        "name": "SSS1"
      },
      {
        "id": 5,
        "name": "SSS2"
      },
      {
        "id": 6,
        "name": "SSS3"
      }
    ],
    "subjects": [
      {
        "id": 3,
        "name": "Agricultural Science"
      },
      {
        "id": 34,
        "name": "Arabic"
      },
      {
        "id": 16,
        "name": "Basic Science"
      },
      {
        "id": 17,
        "name": "Basic Technology"
      },
      {
        "id": 4,
        "name": "Biology"
      },
      {
        "id": 15,
        "name": "Business Studies"
      },
      {
        "id": 6,
        "name": "Chemistry"
      },
      {
        "id": 22,
        "name": "Christian Religious Studies"
      },
      {
        "id": 18,
        "name": "Civic Education"
      },
      {
        "id": 12,
        "name": "Commerce"
      },
      {
        "id": 36,
        "name": "Computer Studies"
      },
      {
        "id": 8,
        "name": "Economics"
      },
      {
        "id": 31,
        "name": "Efik"
      },
      {
        "id": 2,
        "name": "English Language"
      },
      {
        "id": 37,
        "name": "Financial Accounting"
      },
      {
        "id": 33,
        "name": "French"
      },
      {
        "id": 7,
        "name": "Further Mathematics"
      },
      {
        "id": 1,
        "name": "General Mathematics"
      },
      {
        "id": 9,
        "name": "Geography"
      },
      {
        "id": 13,
        "name": "Government"
      },
      {
        "id": 28,
        "name": "Hausa"
      },
      {
        "id": 11,
        "name": "History"
      },
      {
        "id": 21,
        "name": "Home Economics"
      },
      {
        "id": 30,
        "name": "Ibibio"
      },
      {
        "id": 29,
        "name": "Igbo"
      },
      {
        "id": 19,
        "name": "Information and Communication Technology (ICT)"
      },
      {
        "id": 23,
        "name": "Islamic Religious Studies"
      },
      {
        "id": 10,
        "name": "Literature in English"
      },
      {
        "id": 38,
        "name": "Marketing"
      },
      {
        "id": 26,
        "name": "Music"
      },
      {
        "id": 32,
        "name": "Obolo"
      },
      {
        "id": 39,
        "name": "Office Practice"
      },
      {
        "id": 20,
        "name": "Physical and Health Education"
      },
      {
        "id": 5,
        "name": "Physics"
      },
      {
        "id": 24,
        "name": "Religious and Moral Education"
      },
      {
        "id": 14,
        "name": "Social Studies"
      },
      {
        "id": 35,
        "name": "Technical Drawing"
      },
      {
        "id": 25,
        "name": "Visual/Fine Arts"
      },
      {
        "id": 27,
        "name": "Yoruba"
      }
    ],
    "terms": [
      {
        "id": 1,
        "name": "First"
      },
      {
        "id": 2,
        "name": "Second"
      },
      {
        "id": 3,
        "name": "Third"
      }
    ],
    "weeks": [
      {
        "id": 1,
        "name": 1
      },
      {
        "id": 2,
        "name": 2
      },
      {
        "id": 3,
        "name": 3
      },
      {
        "id": 4,
        "name": 4
      },
      {
        "id": 5,
        "name": 5
      },
      {
        "id": 6,
        "name": 6
      },
      {
        "id": 7,
        "name": 7
      },
      {
        "id": 8,
        "name": 8
      },
      {
        "id": 9,
        "name": 9
      },
      {
        "id": 10,
        "name": 10
      },
      {
        "id": 11,
        "name": 11
      },
      {
        "id": 12,
        "name": 12
      }
    ]
  },
  "code": 200
}
Classes Not Found Error
{
  "success": false,
  "message": "No class found, add classes!",
  "errors": null,
  "code": 404,
}
Subjects Not Found Error
{
  "success": false,
  "message": "No subject found, add subjects!",
  "errors": null,
  "code": 404,
}
Terms Not Found Error
{
  "success": false,
  "message": "No term found, add terms!",
  "errors": null,
  "code": 404,
}
Weeks Not Found Error
{
  "success": false,
  "message": "No week found, add weeks!",
  "errors": null,
  "code": 404,
}
Unauthorized Access
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}
Get Lessons
Endpoint: Post /api/v1/superadmin/lessons/lessons/

Description: Get lessons.

Notes:
=> To get lessons you'll have to query it by class id, subject id, term id and week id through the request body.

Headers
Key	Value
Authorization	Bearer {access_token}
Accept	application/json
Request Body
{
  "class": "4"
  "subject": "1",
  "term": "1"
  "week": "1",
}
Success Response (200)
{
  "success": true,
  "message": "Success",
  "content": {
    "lessons": [
      {
        "id": 2,
        "class": "SSS1",
        "subject": "General Mathematics",
        "term": "First",
        "week": 1,
        "topic": "Number Bases System",
        "status": "active",
        "created_at": "22-08-2025",
        "updated_at": "22-08-2025"
      }
    ],
    "links": {
      "first": "http://fastleanersapp.com/api/v1/superadmin/lessons/lessons?page=1",
      "last": "http://fastleanersapp.com/api/v1/superadmin/lessons/lessons?page=1",
      "prev": null,
      "next": null
    },
    "meta": {
      "current_page": 1,
      "last_page": 1,
      "per_page": 20,
      "total": 1
    }
  },
  "code": 200
}
No Lesson Found Response (200)
{
  "success": true,
  "message": "No lesson found, add lessons",
  "content": null,
  "code": 200,
}
Validation Error
{
  "success": false,
  "message": "Validation failed.",
  "errors":{
    "class": [
      "The class field is required."
    ]
    "subject": [
      "The subject field is required."
    ]
    "term": [
      "The term field is required."
    ]
    "week": [
      "The week field is required."
    ]
  },
  "code": 422
}
Fetch Error
{
  "success": false,
  "message": "An error occurred while fetching lessons: (error message)",
  "errors": null,
  "code": 500,
}
Unauthorized Access
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}

Get Specific Lesson
Base Url: https://fastlearnersapp.com

Get Specific Lesson
Endpoint: Get /api/v1/superadmin/lessons/lesson/2

Description: Get specific lesson.

Notes:
=> To get a specific lesson, the lesson id has to be passed as a url parameter.
Headers
Key	Value
Authorization	Bearer {access_token}
Accept	application/json
Success Response (200)
{
  "success": true,
  "message": "Success",
  "content": {
    "id": 2,
    "class": "SSS1",
    "subject": "General Mathematics",
    "term": "First",
    "week": 1,
    "topic": "Number Bases System",
    "overview": "A number base system is a way of representing numbers using a set of digits or symbols.",
    "objectives": [
      {
        "description": "At the end of the lesson, students should understand the following concepts:",
        "points": [
          "Convert from base 10 to other bases",
          "Convert from other bases to base 10",
          "Convert decimal fractions to base 10",
          "Convert between bases other than base 10",
          "Solve basic operations involving number bases"
        ]
      }
    ],
    "key_concepts": {
      "Conversion of number bases": "Changing numbers between different base systems using division or expansion methods.",
      "Operations in number bases": "Performing arithmetic such as addition, subtraction, multiplication, and division under specific base rules.",
      "Base 10 Conversion": "Understanding base 10 as a reference system for calculations between other bases.",
      "Borrowing and Carrying in Bases": "Applying modular arithmetic concepts during operations."
    },
    "summary": "Summary",
    "application": "Application",
    "video_path": null,
    "status": "active",
    "created_at": "22-08-2025",
    "updated_at": "22-08-2025"
  },
  "code": 200
}
Lesson Not Found Error
{
  "success": false,
  "message": "Lesson not found!",
  "errors": null,
  "code": 404,
}
Fetch Error
{
  "success": false,
  "message": "An error occurred while fetching lessons: (error message)",
  "errors": null,
  "code": 500,
}
Unauthorized Access
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}
Get Specific Lesson Content
Endpoint: Get /api/v1/superadmin/lessons/lesson/2/content

Description: Get specific lesson content.

Notes:
=> To get a lesson content, the lesson id needs to be passed as a url parameter.
Headers
Key	Value
Authorization	Bearer {access_token}
Accept	application/json
Success Response (200)
{
  "success": true,
  "message": "Success",
  "content": {
    "id": 2,
    "class": "SSS1",
    "subject": "General Mathematics",
    "term": "First",
    "week": 1,
    "topic": "Number Bases System",
    "overview": "A number base system is a way of representing numbers using a set of digits or symbols.",
    "objectives": [
      {
        "description": "At the end of the lesson, students should understand the following concepts:",
        "points": [
          "Convert from base 10 to other bases",
          "Convert from other bases to base 10",
          "Convert decimal fractions to base 10",
          "Convert between bases other than base 10",
          "Solve basic operations involving number bases"
        ]
      }
    ],
    "key_concepts": {
      "Conversion of number bases": "Changing numbers between different base systems using division or expansion methods.",
      "Operations in number bases": "Performing arithmetic such as addition, subtraction, multiplication, and division under specific base rules.",
      "Base 10 Conversion": "Understanding base 10 as a reference system for calculations between other bases.",
      "Borrowing and Carrying in Bases": "Applying modular arithmetic concepts during operations."
    },
    "summary": "Summary",
    "application": "Application",
    "video_path": null,
    "status": "active",
    "created_at": "22-08-2025",
    "updated_at": "22-08-2025",
    "concepts": [
      {
        "id": 4,
        "order_index": 1,
        "lesson_topic": "Number Bases System",
        "title": "Conversion from Base 10 to Other Bases",
        "description": [
          {
            "heading": null,
            "description": "The Modal Arithmetic that you will learn later in the session is useful in this problem. Its utility here will prepare you for the main topic. For conversion from base 10 to other bases;",
            "image_path": null,
            "points": [
              "Divide the given number repeatedly by the required base",
              "Write down the remainders by the right side.",
              "Divide till the quotient becomes 0.",
              "The answer is the remainder read from bottom to top."
            ]
          }
        ],
        "created_at": "22-08-2025",
        "updated_at": "22-08-2025",
        "examples": [
          {
            "id": 7,
            "order_index": 1,
            "concept_title": "Conversion from Base 10 to Other Bases",
            "title": "Example 1",
            "problem": "Convert 67₁₀ to base 2",
            "solution_steps": [
              "67 ÷ 2 = 33 R1",
              "33 ÷ 2 = 16 R1",
              "16 ÷ 2 = 8 R0",
              "8 ÷ 2 = 4 R0",
              "4 ÷ 2 = 2 R0",
              "2 ÷ 2 = 1 R0",
              "1 ÷ 2 = 0 R1"
            ],
            "answer": "1000011₂",
            "created_at": "22-08-2025",
            "updated_at": "22-08-2025"
          },
          {
            "id": 8,
            "order_index": 2,
            "concept_title": "Conversion from Base 10 to Other Bases",
            "title": "Example 2",
            "problem": "Convert 67₁₀ to base 8",
            "solution_steps": [
              "67 ÷ 8 = 8 R3",
              "8 ÷ 8 = 1 R0",
              "1 ÷ 8 = 0 R1"
            ],
            "answer": "103₈",
            "created_at": "22-08-2025",
            "updated_at": "22-08-2025"
          }
        ],
        "exercises": [
          {
            "id": 5,
            "order_index": 1,
            "concept_title": "Conversion from Base 10 to Other Bases",
            "title": "Exercise 1",
            "problem": "Convert 97₁₀ to base 2",
            "solution_steps": [
              "67 ÷ 2 = 33 R1",
              "33 ÷ 2 = 16 R1",
              "16 ÷ 2 = 8 R0",
              "8 ÷ 2 = 4 R0",
              "4 ÷ 2 = 2 R0",
              "2 ÷ 2 = 1 R0",
              "1 ÷ 2 = 0 R1"
            ],
            "answers": [
              "1110011₂",
              "1001011₂",
              "0101011₂",
              "1000011₂"
            ],
            "correct_answer": "1000011₂",
            "created_at": "22-08-2025",
            "updated_at": "22-08-2025"
          },
          {
            "id": 6,
            "order_index": 2,
            "concept_title": "Conversion from Base 10 to Other Bases",
            "title": "Exercise 2",
            "problem": "Convert 152₁₀ to base 5",
            "solution_steps": [
              "67 ÷ 8 = 8 R3",
              "8 ÷ 8 = 1 R0",
              "1 ÷ 8 = 0 R1"
            ],
            "answers": [
              "103₈",
              "123₈",
              "116₈",
              "100₈"
            ],
            "correct_answer": "103₈",
            "created_at": "22-08-2025",
            "updated_at": "22-08-2025"
          }
        ]
      },
      {
        "id": 5,
        "order_index": 2,
        "lesson_topic": "Number Bases System",
        "title": "Conversion from Any Base to Base 10",
        "description": [
          {
            "heading": null,
            "description": "One of the methods is by expansion in the power of base as shown below.",
            "image_path": null,
            "points": []
          }
        ],
        "created_at": "22-08-2025",
        "updated_at": "22-08-2025",
        "examples": [
          {
            "id": 9,
            "order_index": 1,
            "concept_title": "Conversion from Any Base to Base 10",
            "title": "Example 1",
            "problem": "Convert 321₅ to a number in base 10",
            "solution_steps": [
              "321₅ = 3 × 5² + 2 × 5¹ + 1 × 5⁰",
              "321₅ = 3 × 25 + 10 + 1",
              "321₅ = 75 + 10 + 1"
            ],
            "answer": "86₁₀",
            "created_at": "22-08-2025",
            "updated_at": "22-08-2025"
          },
          {
            "id": 10,
            "order_index": 2,
            "concept_title": "Conversion from Any Base to Base 10",
            "title": "Example 2",
            "problem": "Convert 110101₂ to base 10",
            "solution_steps": [
              "110101₂ = 1 × 2⁵ + 1 × 2⁴ + 0 × 2³ + 1 × 2² + 0 × 2¹ + 1 × 2⁰",
              "110101₂ = 1 × 32 + 1 × 16 + 0 × 8 + 1 × 4 + 0 × 2 + 1 × 1",
              "110101₂ = 32 + 16 + 0 + 4 + 0 + 1"
            ],
            "answer": "53₁₀",
            "created_at": "22-08-2025",
            "updated_at": "22-08-2025"
          }
        ],
        "exercises": [
          {
            "id": 7,
            "order_index": 1,
            "concept_title": "Conversion from Any Base to Base 10",
            "title": "Exercise 1",
            "problem": "Convert 4156 to base 10",
            "solution_steps": [
              "67 ÷ 8 = 8 R3",
              "8 ÷ 8 = 1 R0",
              "1 ÷ 8 = 0 R1"
            ],
            "answers": [
              "86₁₀",
              "72₁₀",
              "84₁₀",
              "68₁₀"
            ],
            "correct_answer": "86₁₀",
            "created_at": "22-08-2025",
            "updated_at": "22-08-2025"
          },
          {
            "id": 8,
            "order_index": 2,
            "concept_title": "Conversion from Any Base to Base 10",
            "title": "Exercise 2",
            "problem": "Convert 101101₂ to base 10",
            "solution_steps": [
              "101101₂ = 1 × 2⁵ + 1 × 2⁴ + 0 × 2³ + 1 × 2² + 0 × 2¹ + 1 × 2⁰",
              "101101₂ = 1 × 32 + 1 × 16 + 0 × 8 + 1 × 4 + 0 × 2 + 1 × 1",
              "101101₂ = 32 + 16 + 0 + 4 + 0 + 1"
            ],
            "answers": [
              "63₁₀",
              "53₁₀",
              "55₁₀",
              "45₁₀"
            ],
            "correct_answer": "53₁₀",
            "created_at": "22-08-2025",
            "updated_at": "22-08-2025"
          }
        ]
      },
      {
        "id": 6,
        "order_index": 3,
        "lesson_topic": "Number Bases System",
        "title": "Conversion of Decimal Fractions to Base 10",
        "description": [
          {
            "heading": null,
            "description": "Conversion of Decimal Fractions to Base 10.",
            "image_path": null,
            "points": []
          }
        ],
        "created_at": "22-08-2025",
        "updated_at": "22-08-2025",
        "examples": [
          {
            "id": 11,
            "order_index": 1,
            "concept_title": "Conversion of Decimal Fractions to Base 10",
            "title": "Example 1",
            "problem": "Convert 11.011₂ to base 10",
            "solution_steps": [
              "11.011₂ = 1 × 2¹ + 1 × 20 + 0 × 2-1 + 1 × 2-2 + 1 × 2-3",
              "11.011₂ = 2 + 1 + 0 + (1/22) + (1/23) ",
              "11.011₂ = 3 + (1/4) + (1/8) = 27/8"
            ],
            "answer": "3(3/8₁₀)",
            "created_at": "22-08-2025",
            "updated_at": "22-08-2025"
          },
          {
            "id": 12,
            "order_index": 2,
            "concept_title": "Conversion of Decimal Fractions to Base 10",
            "title": "Example 2",
            "problem": "Convert 241.238 to base 10",
            "solution_steps": [
              "241.238  = 2 × 82 + 4 × 81 + 1 × 80 + 2 × 8−1 + 3 × 8−2",
              "241.238 = 2 × 64 + 4 × 8 + 1 × 1 + 2 × (1/8) + 3 × (1/64)",
              "241.238 = 128 + 32 + 1 + (2/8) + (3/64)",
              "241.238 = 161 + (19/64)"
            ],
            "answer": "161.29710",
            "created_at": "22-08-2025",
            "updated_at": "22-08-2025"
          }
        ],
        "exercises": []
      }
    ],
    "general_exercises": [
      {
        "id": 5,
        "order_index": 1,
        "lesson_topic": "Number Bases System",
        "problem": "Convert 97₁₀ to base 2",
        "solution_steps": [
          "67 ÷ 2 = 33 R1",
          "33 ÷ 2 = 16 R1",
          "16 ÷ 2 = 8 R0",
          "8 ÷ 2 = 4 R0",
          "4 ÷ 2 = 2 R0",
          "2 ÷ 2 = 1 R0",
          "1 ÷ 2 = 0 R1"
        ],
        "answers": [
          "1110011₂",
          "1001011₂",
          "0101011₂",
          "1000011₂"
        ],
        "correct_answer": "1000011₂",
        "created_at": "22-08-2025",
        "updated_at": "22-08-2025"
      },
      {
        "id": 6,
        "order_index": 2,
        "lesson_topic": "Number Bases System",
        "problem": "Convert 152₁₀ to base 5",
        "solution_steps": [
          "67 ÷ 8 = 8 R3",
          "8 ÷ 8 = 1 R0",
          "1 ÷ 8 = 0 R1"
        ],
        "answers": [
          "103₈",
          "123₈",
          "116₈",
          "100₈"
        ],
        "correct_answer": "103₈",
        "created_at": "22-08-2025",
        "updated_at": "22-08-2025"
      },
      {
        "id": 7,
        "order_index": 3,
        "lesson_topic": "Number Bases System",
        "problem": "Convert 4156 to base 10",
        "solution_steps": [
          "67 ÷ 8 = 8 R3",
          "8 ÷ 8 = 1 R0",
          "1 ÷ 8 = 0 R1"
        ],
        "answers": [
          "86₁₀",
          "72₁₀",
          "84₁₀",
          "68₁₀"
        ],
        "correct_answer": "86₁₀",
        "created_at": "22-08-2025",
        "updated_at": "22-08-2025"
      },
      {
        "id": 8,
        "order_index": 4,
        "lesson_topic": "Number Bases System",
        "problem": "Convert 101101₂ to base 10",
        "solution_steps": [
          "101101₂ = 1 × 2⁵ + 1 × 2⁴ + 0 × 2³ + 1 × 2² + 0 × 2¹ + 1 × 2⁰",
          "101101₂ = 1 × 32 + 1 × 16 + 0 × 8 + 1 × 4 + 0 × 2 + 1 × 1",
          "101101₂ = 32 + 16 + 0 + 4 + 0 + 1"
        ],
        "answers": [
          "63₁₀",
          "53₁₀",
          "55₁₀",
          "45₁₀"
        ],
        "correct_answer": "53₁₀",
        "created_at": "22-08-2025",
        "updated_at": "22-08-2025"
      }
    ],
    "check_markers": [
      {
        "id": 2,
        "lesson_topic": "Number Bases System",
        "overview": 5,
        "lesson_video": 5,
        "concept_one": 20,
        "concept_two": 25,
        "concept_three": 25,
        "concept_four": 0,
        "concept_five": 0,
        "concept_six": 0,
        "concept_seven": 0,
        "general_exercises": 20,
        "created_at": "22-08-2025",
        "updated_at": "22-08-2025"
      }
    ]
  },
  "code": 200
}
Lesson Not Found Error
{
  "success": false,
  "message": "Lesson not found!",
  "errors": null,
  "code": 404,
}
Fetch Error
{
  "success": false,
  "message": "An error occurred while fetching lessons: (error message)",
  "errors": null,
  "code": 500,
}
Unauthorized Access
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}

