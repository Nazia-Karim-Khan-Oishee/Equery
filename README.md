**Equery is a platform where students can share their concerns, questions, and insights about study materials, concepts, and other academics related topics. This platform aims to promote collaboration and knowledge-sharing among students.**

This is a **backend-only** project developed for the Server Programming Lab course.

## Key Technologies
- Node.js as the runtime environment
- Express as the application framework
- MongoDB as the database program

## Key Features
Equery is a platform for students to share concerns and insights related to academic topics, emphasizing collaboration and knowledge-sharing.

### Seek Information
Users can ask questions by posting them. Users can include their text and the topic of the question. Users can also search for questions based on the topic and timestamp.

### Comment
Users can reply to each other's questions via commenting, facilitating knowledge-sharing.

### Upload Resource
Users can contribute by uploading resources. Resources are available for all other authenticated users to access and can be uploaded as a PDF document.

### Bookmark Resource
Users can bookmark a resource of their preference for easy access.

### Voting System
Users can upvote or downvote a question and comment. These votes can be used as a metric to evaluate the question's or comment's impact or authenticity.

### Other Features
In addition to the key features mentioned above, Equery also includes a basic authentication system and profile management, including profile image handling.

## Setup Instructions
- Run the below command in your terminal to install all the necessary packages - 
```bash
npm install
```

- Use your own **MONGO_URI** to connect to the dataase. You can get your own URI from **[here](https://www.mongodb.com/)**
 
- Use your own **GOOGLE_CLIENT_ID** and **GOOGLE_CLIENT_SECRET** for Google OAuth. You can get your own credential from **[here](https://cloud.google.com/free/?utm_source=google&utm_medium=cpc&utm_campaign=japac-ROA-all-en-dr-BKWS-all-core-trial-PHR-dr-1605216&utm_content=text-ad-none-none-DEV_c-CRE_662845895894-ADGP_Hybrid+%7C+BKWS+-+BRO+%7C+Txt+~+GCP_General_gcp_misc-KWID_43700077169324293-aud-1596662389134:kwd-299298611221&userloc_1001441-network_g&utm_term=KW_google%20clud&gad_source=1&gclid=CjwKCAiA4smsBhAEEiwAO6DEjfO5wklwgkzZWOroH_W47vvVnc5vtSgPE_XL_5uWlNmFKf-0ohSJtxoCCUgQAvD_BwE&gclsrc=aw.ds)https://cloud.google.com/free/?utm_source=google&utm_medium=cpc&utm_campaign=japac-ROA-all-en-dr-BKWS-all-core-trial-PHR-dr-1605216&utm_content=text-ad-none-none-DEV_c-CRE_662845895894-ADGP_Hybrid+%7C+BKWS+-+BRO+%7C+Txt+~+GCP_General_gcp_misc-KWID_43700077169324293-aud-1596662389134:kwd-299298611221&userloc_1001441-network_g&utm_term=KW_google%20clud&gad_source=1&gclid=CjwKCAiA4smsBhAEEiwAO6DEjfO5wklwgkzZWOroH_W47vvVnc5vtSgPE_XL_5uWlNmFKf-0ohSJtxoCCUgQAvD_BwE&gclsrc=aw.ds)**

  
Open an integrated terminal and run the below command to start the server- 
```bash
nodemon index
```
Follow the routes to create appropriate API endpoints. You can use postman for executing API requests.

