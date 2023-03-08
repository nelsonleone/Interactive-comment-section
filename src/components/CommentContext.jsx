import data from "../data.json"
import React from "react";
import immer from "immer";
import {useImmerReducer} from "use-immer";
import { useState, useEffect,  useReducer, useRef} from "react";
import { nanoid } from "nanoid";
import { ACTIONS } from "../utils/ACTIONS";
import * as timeago from 'timeago.js'



const Context = React.createContext()

function reducer(draftedState,action){
   const payload = action.payload;

   switch(action.type){
      case ACTIONS.updateState:
         draftedState.comments.map(comment => {
            comment.currentUserVoteType = null
            comment.score = comment.score + Math.floor(Math.random() * 3)
         })

        draftedState.comments.map(comment => {
         return comment.replies.map(reply => {
            reply.currentUserVoteType = null
            reply.score = reply.score + Math.floor(Math.random() * 3)
         })
       })

       draftedState.deleteModalShow =  false
       draftedState.pendingDeleteID = null


       draftedState.comments.sort(function(a,b){
         return  b.score - a.score || b.user.username.localeCompare(a.user.username)
       })
      break;

      case ACTIONS.sort:
         draftedState.comments.sort(function(a,b){
            return  b.score - a.score || b.user.username.localeCompare(a.user.username)
          })
      break;



      case ACTIONS.voteContent:
         payload.contentType === "comment" ? draftedState.comments.filter(comment => {
            if(comment.currentUserVoteType ===  payload.voteType)return;

            if(comment.id === payload.id && payload.voteType === "upvote"){
               comment.currentUserVoteType = payload.voteType
               return comment.score++
            }else if(comment.id === payload.id && payload.voteType === "downvote"){
               comment.currentUserVoteType = payload.voteType
               return comment.score--;
            }else{
               return comment
            }
         })
         :
         draftedState.comments.filter(comment => {
            return comment.replies.filter(reply => {
               if(reply.currentUserVoteType === payload.voteType)return;

               if(reply.id === payload.id && payload.voteType === "upvote"){
                  reply.currentUserVoteType = payload.voteType
                  return reply.score++
               }else if(reply.id === payload.id && payload.voteType === "downvote"){
                  reply.currentUserVoteType = payload.voteType
                  return reply.score--;
               }else{
                  return reply
               }
            })
         })
      break;



      case ACTIONS.postComment :
         draftedState.comments.unshift({...payload})
      break;

      case ACTIONS.deleteComment:
         const newComments = draftedState.comments.filter(comment => comment.id !== payload.id)
         draftedState.comments = newComments;
      break;

      case ACTIONS.edit:
         draftedState.isEditing =  !draftedState.isEditing;
         draftedState.beingEditted = payload.id

         draftedState.edittedValue =  payload.value;
      break;

      case ACTIONS.onchangeComment:
         draftedState.edittedValue = payload.value
      break;

      case ACTIONS.hasEdited :
         if(payload.contentType === "comment"){
            draftedState.comments.filter(comment => {
               comment.id === payload.id ? comment.content =  draftedState.edittedValue : comment
            })
            draftedState.isEditing = false;
            draftedState.edittedValue = "";
         }
         
         else if(payload.contentType === "reply"){
            const index = payload.commentIndex;
            draftedState.comments[index].replies.filter(reply => {
               return reply.id === payload.id ? reply.content =  draftedState.edittedValue : reply
            })
            draftedState.isEditing = false;
            draftedState.edittedValue = "";
         }
      break;

      case ACTIONS.deleteReply:
         draftedState.comments[payload.commentIndex].replies = payload.filteredReplies
      break;

      case ACTIONS.showModal:
         draftedState.deleteModalShow = !draftedState.deleteModalShow
         draftedState.pendingDeleteID = payload.pendingDeleteID
      break;


      case ACTIONS.reply:
         draftedState.replyValue = payload.username;
         draftedState.replyingTo =  payload.username
         draftedState.pendingReply = !draftedState.pendingReply
         draftedState.pendingReplyID = payload.id
         setTimeout(() => {
            payload.ref.current.focus()
         }, 100);
      break;

      case ACTIONS.onchangeReply:
         draftedState.replyValue = payload.value;
      break;

      case ACTIONS.postReply :
         const validComment =  draftedState.comments.filter(comment => {
            return comment.id === payload.id 
         })[0]

         const modifiedValue = draftedState.replyValue.replace(draftedState.replyingTo,"")
         draftedState.replyValue = modifiedValue;
         

         validComment.replies.push(
            {
               score:0,
               user:{
                  image: { 
                     png: "/images/avatars/image-juliusomo.png",
                     webp: "/images/avatars/image-juliusomo.webp"
                  },
                  username:"juliusomo",
                  currentUserTag:"you"
                 },
               id:nanoid(),
               content: draftedState.replyValue,
               replyingTo:draftedState.replyingTo,
               createdAt: timeago.format(new Date())
            }
         )

         draftedState.pendingReply = false;
         draftedState.replyValue = "";
         draftedState.pendingReplyID =  null
         draftedState.replyingTo = null;

      break;
   }
}











// main component
function CommentContext(props){
   const appData = data;
   const contextStates = 
   localStorage.getItem('state') ?
   JSON.parse(localStorage.getItem('state'))
   :
   {
      comments: appData.comments,
      currentUser:appData.currentUser,
      replies: appData.comments.replies,
      edittedValue: "",
      isEditing:false,
      beingEditted: null,
      replyValue:"",
      replyingTo:null,
      deleteModalShow: false,
      pendingDeleteID:null,
      pendingReply:false,
      pendingReplyID:null
   }

   const [state,dispatch] = useImmerReducer(reducer,contextStates)
   const [newComment,setNewComment] = useState("")
   const replyRef = useRef(null)




   function voteContent(contentType,username,id,voteType){
      dispatch({
         type: ACTIONS.voteContent,
         payload: {
            contentType,
            voteType,
            username,
            id
         }
      })
   }

   function postNewComment(){
      if(newComment === "" || state.isEditing || state.pendingReply)return;
      const user = state.currentUser;
      dispatch({
         type:ACTIONS.postComment,
         payload:{
            id: nanoid(),
            content:newComment,
            score: 0,
            user: {...user,currentUserTag:"you"},
            replies: [],
            createdAt:timeago.format(new Date())
         }
      })

      setNewComment("")
   }


   function showModal(id){
      dispatch({
         type: ACTIONS.showModal,
         payload:{
            pendingDeleteID:id
         }
      })
   }


   function handleEditDelete(contentType,actionType,commentID,replyID){
      let id ;
      if(contentType === "comment" && actionType === "delete"){
         id = commentID;
         dispatch({
            type: ACTIONS.deleteComment,
            payload:{id}
         })
      }
      else if(contentType === "comment" && actionType === "edit" && state.edittedValue === ""){
         id = commentID;
         const comment = state.comments.filter(comment=> {
            return comment.id === commentID 
         })[0]

         dispatch({
            type: ACTIONS.edit,
            payload:{
               id,
               value: comment.content,
            }
         })
      }

      else if(contentType === "reply" && actionType === "delete"){
         id = replyID;
         const commentIndex = state.comments.findIndex(comment => {
            return comment.id === commentID
         })

         const filteredReplies = state.comments[commentIndex].replies.filter(reply => {
            return reply.id !== id
         })

         dispatch({
            type: ACTIONS.deleteReply,
            payload:{id,filteredReplies,commentIndex,}
         })
      }

      else if(contentType === "reply" && actionType === "edit" && state.edittedValue === ""){
         id = replyID;
         const commentIndex = state.comments.findIndex(comment => {
            return comment.id === commentID
         })

         const reply = state.comments[commentIndex].replies.filter(reply => {
            return reply.id === id
         })[0]
         dispatch({
            type:ACTIONS.edit,
            payload:{
               id,
               value:reply.content
            }
         })
      }
   }


   function submitEdit(id,contentType,commentID){

      if(contentType === "reply"){
         const commentIndex = state.comments.findIndex(comment => {
            return comment.id === commentID
         })


         dispatch({
            type:  ACTIONS.hasEdited,
            payload:{
               id,
               contentType,
               commentIndex
            }
         })
      }
   
      else if(contentType === "comment"){
         dispatch({
            type:  ACTIONS.hasEdited,
            payload:{
               id,
               contentType
            }
         })
      }
   }
   
   
   
   function handleCommentInputChange(value){
      setNewComment(value)
   }
   
   function handleEditInputChange(value){
      dispatch({
         type: ACTIONS.onchangeComment,
         payload:{value}
      })
   }
   

   function handleReply(ID,username){
      if(state.replyValue)return;
      dispatch({
         type: ACTIONS.reply,
         payload:{
            username:username,
            id:ID,
            ref:replyRef
         }
      })
   }
   
   function handleReplyInputChange(value){
      dispatch({
         type: ACTIONS.onchangeReply,
         payload:{
            value:value
         }
      })
   }
   function handlePostReply(commentID){
      dispatch({
         type:ACTIONS.postReply,
         payload:{
            id: commentID
         }
      })
   }




   useEffect(() => {
      dispatch({
         type:ACTIONS.updateState
      })
   },[])

   useEffect(() => {
      localStorage.setItem('state',JSON.stringify(state))

      dispatch({
         type:ACTIONS.sort
      })
   },[state])




   

   return(
      <Context.Provider  
         value={
            {comments:state.comments,
            currentUser:state.currentUser,
            replyRef:replyRef,
            voteContent,
            newComment,
            postNewComment,
            handleEditDelete,
            submitEdit,
            handleCommentInputChange,
            handleEditInputChange,
            edittedValue:state.edittedValue,
            isEditing:state.isEditing,
            beingEditted:state.beingEditted,
            showModal,
            deleteModalShow:state.deleteModalShow,
            pendingDeleteID:state.pendingDeleteID,
            handleReplyInputChange,
            handleReply,
            replyValue:state.replyValue,
            pendingReply:state.pendingReply,
            pendingReplyID:state.pendingReplyID,
            handlePostReply
            }
         }>
         {props.children}
      </Context.Provider>
   )
}

export {CommentContext, Context}