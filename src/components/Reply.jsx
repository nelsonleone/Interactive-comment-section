import {FaPlus} from "react-icons/fa";
import {FaMinus} from "react-icons/fa";
import { FaReply } from 'react-icons/fa';
import { FaTrash } from 'react-icons/fa';
import { MdEdit } from "react-icons/md";
import { Context } from "./CommentContext";
import { useContext} from "react";

export default function Reply({reply,commentID}){
   const {
      voteContent,
      currentUser,
      handleEditDelete,
      isEditing,
      submitEdit,
      edittedValue,
      handleEditInputChange,
      beingEditted,
      showModal,
      deleteModalShow,
      pendingDeleteID,
      handleReply,
      pendingReply,
      pendingReplyID,
      handleReplyInputChange,
      replyValue,
      handlePostReply
   } = useContext(Context)
   return(
      <div className="reply">
         <div className="vote-btn">
            <button 
              aria-labelledby={`upvote${reply.id}`}
              aria-controls={`vote${reply.id}`}
              onClick={() => voteContent("reply",reply.user.username,reply.id,"upvote")}
              >
               <span className="sr-only" id={`upvote${reply.id}`}>Upvote This Comment</span>
               <FaPlus />
            </button>
            <span className="vote-count" id={`vote${reply.id}`}>
               {reply.score}
            </span>
            <button 
              aria-labelledby={`downvote${reply.id}`} 
              aria-controls={`vote${reply.id}`}
              onClick={() => voteContent("reply",reply.user.username,reply.id,"downvote")}
              >
               <span className="sr-only" id={`downvote${reply.id}`}>Down Vote This Comment</span>
               <FaMinus />
            </button>
         </div>

         <div className="row">
            <div>
               <img src={reply.user.image.webp} alt="replyer's Image"/>
               <span className="username">{reply.user.username}</span>
               {reply.user.currentUserTag &&
                  <span className="you-tag">you</span>
               }
               <span className="reply-time">{reply.createdAt}</span>
            </div>

            <div className="action-icons">
               {reply.user.currentUserTag ?
                  <>
                     <button className="delete-btn" onClick={() => showModal(reply.id)}>
                           <FaTrash />  Delete
                     </button>
                     <button className="edit-btn" onClick={()  => handleEditDelete("reply","edit",commentID,reply.id)}>
                           <MdEdit /> Edit
                     </button>
                  </>
                  :
                <button onClick={() => handleReply(commentID,reply.user.username)}>
                  <FaReply /> Reply
                </button>
               }
            </div>
            
         </div>
         {
            isEditing  && beingEditted === reply.id ?
            <div className="edit-comment">
               <textarea 
                  type="text" 
                  value={edittedValue} 
                  onChange={(e) => handleEditInputChange(e.target.value)}
                  name="editInput"
               ></textarea>
               <button  className="update-btn custom-btn" onClick={() => submitEdit(reply.id,"reply",commentID)}>UPDATE</button>
            </div>
            :
            <p>
              <span className="replying-to">@{reply.replyingTo}</span>
              {reply.content}
            </p>
         }

         {
            deleteModalShow ?
            pendingDeleteID === reply.id ?
            <div className="delete-modal">
                <div className="modal-content">
                  <h2>Delete Comment</h2>
                  <p>
                      Are you sure you want to delete this comment? This will remove the comment and can't be undone.
                  </p>
                  <div className="modal-actionBtns">
                      <button onClick={showModal}>NO, CANCEL</button>
                      <button onClick={() => handleEditDelete("reply","delete",commentID,reply.id)}>YES, DELETE</button>
                  </div>
                </div>
            </div>
            :
            ""
            :
            ""
          }
      </div>
   )
}
