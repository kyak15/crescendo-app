# Crescendo App

Crescendo is a Full Stack App that allows users to view Trending Albums and their information. Signed in users can rate, review, and add albums to their own listen list. The trending data on the website utilizes LastFM's API and all information from the albums use the Spotify API. The backend of the application utilizes Node, Express, and a PostgreSQL database. The frontend was built using React and vanilla CSS. In order to preserve proper authentication and authorization, signed in users have a hashed password on the backend. The webapp also uses HTTPS cookies that store a JWT in them to provide maximum security. 


![home](https://github.com/kyak15/crescendo-app/assets/112513039/02745310-7cf6-46cc-8602-588f269f091b)

# Trending Albums Page

On this page, users use real time trending data from the LastFM API to see what music lovers in the US are currently listening to. Users can also search for artists or albums using the magnifying glass icon. 

![albumspage](https://github.com/kyak15/crescendo-app/assets/112513039/2722b709-601d-4e65-8ccd-a4c2a5a24a7d)

# Single Album Page

On an album's page, signed in users can review it based on a 5 star system and can also add a review. If they haven't listened yet, they can add the album to their listen list for later. Users can also hear previews of tracks from that artist by clicking the central buttons. The songs come from the spotify API that hold 30 second previews of an artist's most popular tracks. The rest of the page has the title of the album, its tracklist, and other users' reviews below the main album information. 

![lone](https://github.com/kyak15/crescendo-app/assets/112513039/ced175fb-e10c-4a8f-a3dd-e48a5be53a3a)

# Profile Page

User's are allowed to choose 5 of their favorite albums to display on their profile as their _favorite five_. In addition, their profiles showcase their recent reviews, and current listen list. 

![user](https://github.com/kyak15/crescendo-app/assets/112513039/97995426-3d86-495b-8a29-aa7a4127baad)

![userlisten](https://github.com/kyak15/crescendo-app/assets/112513039/ec702417-1fb4-447b-ac93-9d6ae0477444)

![userrecv](https://github.com/kyak15/crescendo-app/assets/112513039/4ce0fd59-6d5e-4fab-aba3-37a1b3f32a09)


