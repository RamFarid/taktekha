# Online Tic-tac-toe game
This project was a turning point for me. I was facing my fear of dealing with databases and then ... I got rid of it
Tic-Tac-Toe is the most popular arcade game over the world. 
In the world of programming, it is also one of the first logical thinking that a programmer experiences. **I decided to make it as a full game**!
`Taktekha` website game it considered as a full-stack website since I used `firebase` to manage backend and React for frontend capabilities. All ideas made from my own, all features and logical functionalities work perfectly💫. Let's clarify the features

## Features
- **User authentication**  
   The User Auth provided the user making accounts that is the basic idea that push me for make this Website game. **The user can't play without creating an account** and The user can create an account by:
  - Google provider
  - Facebook provider (Not working due to the FB permissions!)
- **Friends list**  
   After creating an account now the user can send friends request to their friends and receive the requests.
- **Games Mechanism (Create & Join)**  
   Now the User can played! by:
   - Create a game  
      The user can create a game with sharing the link to the user or can send invitation to the friend from their list **if the user is Online**
   - Join a game  
      As create the game the user can joined the game by click on the shared link or accept the invitation from the friend
- **The Game Chat**  
   The Game chat is the way of connection in the game. Each game has its special private chat ended by end the game
- **Local play**  
   The User can play with friends even there is no internet. With `PWA`  the user can use the website (Application) when there is no connection and open the local game and play with their friends
- **Games History**  
   The user can return back to any match they played See the game, or the chat

## Drawbacks
Ahhh. After all these advantages that can take this game to the top, there is only one drawback.
#### **The Client control all features!!**
What was that mean?! This mean that all logic of the application on the client-side 😅 Database control such as deleting data, adding data or reading data is done through the client side code **not from a Server**  

Let me clarify, If you send a friend request to your friend (X). When (X) accepts the request, **From the client side on their phone the followings have to be done**:
- The Requested deleted from DB
- X added themselve on your friends list 
- X added yourself on their friends list.  

**Such an example that you have given would be all other scenarios of DB control or even the storage (Firebase Storage) control**

## Learning outcomes:
- Deal with Real-Time database (RTDB) in Firebase

### Non related to front end
- knowledge on the Token and its mechanism

> I used **firebase** for backend and **`PWA`** to make the website install as a native application. 