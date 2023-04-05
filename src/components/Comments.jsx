import { Context } from "./CommentContext";
import { nanoid } from "nanoid";
import { useState, useContext} from "react";
import {FaPlus} from "react-icons/fa";
import {FaMinus} from "react-icons/fa";
import { FaReply } from 'react-icons/fa';
import { FaTrash } from 'react-icons/fa';
import { MdEdit } from "react-icons/md";
import Reply from "./Reply";

export default  function Comments(){
  const {
    comments,
    currentUser,
    voteContent,
    handleEditDelete,
    isEditing,
    submitEdit,
    edittedValue,
    editRef,
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
    handlePostReply,
    replyRef
  } = useContext(Context)
    
  const [show,setshow]  = useState(false)
    
    
  return(
    comments.map(comment => {
      return(
        <div key={comment.id}>
          <div className="comment">
            <div className="vote-btn">
                <button 
                  aria-labelledby="upvote" 
                  aria-controls="vote"
                  onClick={()  => voteContent("comment",comment.user.username,comment.id,"upvote")}
                  >
                  <p className="sr-only" id="upvote">Upvote This Comment</p>
                  <FaPlus />
                </button>
                <span className="vote-count" id="vote">
                  {comment.score}
                </span>
                <button 
                aria-labelledby="downvote" 
                aria-controls="vote"
                onClick={()  => voteContent("comment",comment.user.username,comment.id,"downvote")}
                >
                  <p className="sr-only" id="downvote">Down Vote This Comment</p>
                  <FaMinus />
                </button>
            </div>

            <div className="row">
                <div>
                  <img src={comment.user.image.webp} alt="commenter's Image"/>
                  <span className="username">{comment.user.username}</span>
                  {comment.user.currentUserTag &&
                  <span className="you-tag">{comment.user.currentUserTag}</span>
                  }
                  <span className="comment-time">{comment.createdAt}</span>
                </div>

                <div className="action-icons">
                  {comment.user.currentUserTag ?
                      <>
                        <button className="delete-btn" onClick={() => showModal(comment.id)}>
                            <FaTrash />  Delete
                        </button>
                        <button className="edit-btn" onClick={()  => handleEditDelete("comment","edit",comment.id)}>
                            <MdEdit /> Edit
                        </button>
                      </>
                      :
                      <button onClick={() => handleReply(comment.id,comment.user.username,"comment")}>
                        <FaReply /> Reply
                      </button>
                  }
                </div>

            </div>
            {
              isEditing  && beingEditted === comment.id ?
              <div className="edit-comment">
                <label htmlFor="edit-comment" className="sr-only">Edit Comment</label>
                <textarea 
                    type="text" 
                    value={edittedValue} 
                    onChange={(e) => handleEditInputChange(e.target.value)}
                    name="editInput"
                    id="edit-comment"
                ></textarea>
                <button  className="update-btn custom-btn" onClick={() => submitEdit(comment.id,"comment")}>UPDATE</button>
              </div>
              :
              <p>{comment.content}</p>
            }
          </div>

          <div className="replies">
            {comment.replies.map(reply => {
                return(
                  <Reply reply={reply} key={nanoid()} commentID={comment.id}/>
                )
            })}
            
            {
              pendingReply ?
              pendingReplyID === comment.id ?
              <div className="input-reply reply">
                <img src={currentUser.image.webp} alt="user-image" />
                <textarea 
                    type="text" 
                    value={replyValue} 
                    name="replyInput"
                    onChange={(e) => handleReplyInputChange(e.target.value)}
                    ref={replyRef}
                ></textarea>
                <button  className="reply-btn custom-btn" onClick={() => handlePostReply(comment.id)}>REPLY</button>
              </div>
              :""
              :""
            }
          </div>

          {
            deleteModalShow ?
            pendingDeleteID === comment.id ?
            <div className="delete-modal">
                <div className="modal-content">
                  <h2>Delete Comment</h2>
                  <p>
                      Are you sure you want to delete this comment? This will remove the comment and can't be undone.
                  </p>
                  <div className="modal-actionBtns">
                      <button onClick={() => showModal()}>NO, CANCEL</button>
                      <button onClick={() => handleEditDelete("comment","delete",comment.id)}>YES, DELETE</button>
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
    })
    
  )
}