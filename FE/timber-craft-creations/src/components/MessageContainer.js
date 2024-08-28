
import { useState, useEffect } from 'react';
import Collapse from 'react-bootstrap/Collapse';
import api from '../api/axiosConfig';

function MessageContainer({ message, getAllUnreadMessages }) {
    const [open, setOpen] = useState(false);
    const [reply, setReply] = useState("");

    const formatDate = (date) => {
        date = new Date(date);
        const options = { day: '2-digit', month: 'short', year: 'numeric' };
        return date.toLocaleDateString('en-GB', options).replace(/ /g, '-');
    };

    const handleStatusUpdate = async (orderId) => {
        let response;
        if (reply.trim()) {
            response= await api.put(`/message/replyAndMarkRead/${message.msgId}`, reply.trim(), {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        } else {
            response= await api.put(`/message/replyAndMarkRead/${message.msgId}`)
        }
        if (response.status === 200) {
            getAllUnreadMessages();
        }
    };

    return (
        <>
            <div
                onClick={() => setOpen(!open)}
                aria-controls={`collapse-container-${message?.msgId}`}
                aria-expanded={open}
                style={{
                    cursor: 'pointer',
                    padding: '10px',
                    backgroundColor: '#f0f0f0',
                    color: 'black',
                    border: '1px solid #ccc',
                    width: '100%',
                    marginBottom: '10px'
                }}
            >
                <strong>Message ID:</strong> {message?.msgId} <strong>Name:</strong> {message?.firstName} {message?.lastName} <strong>Email:</strong> {message?.email} <strong>Date:</strong> {formatDate(message?.createdAt)}
            </div>
            
            <Collapse in={open}>
                <div id={`collapse-container-${message?.id}`} className="border rounded border-2 border-dark mb-2">
                    <div className="border-bottom border-2 border-dark" style={{ display: 'flex', gap: '10px' }}>
                        <div className="ps-2" style={{ flex: '0 0 50%' }}>
                            <p>{message?.message} </p>
                        </div>

                        <div className="form-group ps-2 pe-3 border-start border-2 border-dark"
                            style={{ flex: '0 0 50%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

                            <textarea
                                className="form-control"
                                placeholder="If left empty, no reply will be sent to the user, only the message will be marked as read."
                                rows="4"
                                id="description"
                                name="description"
                                value={reply}
                                onChange={(e) => setReply(e.target.value)}
                                style={{ flexGrow: 1, marginRight: '10px' }}
                            />

                            <button className="btn btn-primary" onClick={() => handleStatusUpdate(message?.id)} style={{ whiteSpace: 'nowrap' }}>
                                Reply and Mark Read
                            </button>
                        </div>
                    </div>
                </div>
            </Collapse>
        </>
    );
}

export default MessageContainer;
