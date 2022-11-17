import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import api from "../../api";
import Comment from "./comment";
import AddCommentForm from "../addCommentForm";
const CommentsList = ({ userId }) => {
    const [comments, setComments] = useState();
    useEffect(() => {
        api.comments
            .fetchCommentsForUser(userId)
            .then((data) => setComments(data));
    }, []);
    const handleRemoveComment = (id) => {
        api.comments
            .remove(id)
            .then((id) => setComments(comments.filter((x) => x._id !== id)));
    };
    const handleSubmit = (data) => {
        api.comments
            .add({ ...data, pageId: userId })
            .then((data) => setComments([...comments, data]));
    };
    if (comments) {
        return (
            <>
                <div className="card mb-3">
                    <div className="card-body ">
                        <h2>Comments</h2>
                        <div className="card mb-2">
                            <div className="card-body ">
                                <AddCommentForm onSubmit={handleSubmit} />
                            </div>
                        </div>
                        {comments.map((item) => (
                            <Comment
                                key={item._id}
                                {...item}
                                onRemove={handleRemoveComment}
                            />
                        ))}
                    </div>
                </div>
            </>
        );
    } else {
        return <h1>Loading</h1>;
    }
};
CommentsList.propTypes = {
    userId: PropTypes.string.isRequired
};
export default CommentsList;
