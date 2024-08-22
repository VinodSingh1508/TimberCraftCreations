package com.javafreak.TimberCraft.Creations.service;

import java.util.List;
import java.util.Optional;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.javafreak.TimberCraft.Creations.entity.Message;
import com.javafreak.TimberCraft.Creations.repository.MessageRepository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

@Service
public class MessageService {
	
	@Autowired
	MessageRepository messageRepository;
	
	@Autowired
	EmailService emailService;

    @PersistenceContext
    private EntityManager entityManager;

    public Message createMessage(Message message) {
        Integer generatedId;
        do {
            generatedId = generateRandom6DigitNumber();
        } while (!isMsgIdUnique(generatedId));
        message.setMsgId(generatedId);

        return messageRepository.save(message);
    }

    private Integer generateRandom6DigitNumber() {
        Random random = new Random();
        return 100000 + random.nextInt(900000);
    }

    private boolean isMsgIdUnique(Integer id) {
        return entityManager.find(Message.class, id) == null;
    }


	public List<Message> gatAllUnread() {
		return messageRepository.findByIsReadFalseOrderByCreatedAtAsc();
	}

	public String replyAndMarkRead(Integer id, String reply) {
		String resp="Message with ID "+id+ " not found";
		Optional<Message> dbMsg=messageRepository.findById(id);
		if (dbMsg.isPresent()) {
			Message dbMsgObj = dbMsg.get();
			dbMsgObj.setRead(true);
			messageRepository.save(dbMsgObj);
			resp="Message ("+id+") marked as read";
			if(null!=reply && reply.trim().length()!=0) {
				emailService.sendEmailToUser(dbMsgObj.getEmail(), dbMsgObj.getMsgId()+"", reply);
				resp="Reply sent and message ("+id+") marked as read";
			}
		}
		return resp;
	}

}
