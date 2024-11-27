const httpStatus = require('http-status');
const { client_url, mail_config } = require('../config/env');
const { STACKHOLDER } = require('../enums');
const ApiError = require('../error/ApiError');
const { findUser } = require('../services/user.service');
const { findOrderService } = require('../services/order.service');
const template = require('../utils/template');
const generateEmailTransporter = require('../utils/generate-email-transporter');
const { decrypt } = require('../utils/encrypt-decrypt');
const { updateReviewService } = require('../services/review.service');

/**
 * @summary Socket starter
 * @param {httpServer} server
 * */
const socket = (server) => {
  const io = require('socket.io')(server, {
    cors: {
      origin: client_url, // Replace with your frontend URL
      methods: ['GET', 'POST', 'DELETE', 'PUT']
    }
  });

  let onlineUsers = new Map(); 

  io.on('connection', (socket) => {
    console.log('User connected');

    socket.on('join-admin', () => {
      socket.join(STACKHOLDER.ADMIN);
      console.log('User joined admin room:', socket.id);
    });

    socket.on('join-user', (data) => {
      socket.join(data.email);
      console.log(`User-${data.email} joined user room:`, socket.id);
    });

    socket.on('userOnline', (userId) => {
      onlineUsers.set(decrypt(userId), socket.id); // Map userId to socketId
      io.emit('onlineUsers', Array.from(onlineUsers.keys())); // Broadcast online users
      console.log('User online:', decrypt(userId));
    });

    // Handle disconnection
     socket.on('disconnect', () => {
       const userId = [...onlineUsers.entries()].find(
         ([_, id]) => id === socket.id
       )?.[0];
       if (userId) {
         onlineUsers.delete(userId);
         io.emit('onlineUsers', Array.from(onlineUsers.keys())); // Broadcast online users
         console.log('User offline:', userId);
       }
     });

    socket.on('new-order', (data) => {
      io.to(STACKHOLDER.ADMIN).emit('new-order', data.data);
    });

    socket.on('product-added', (data) => {
      io.to(STACKHOLDER.ADMIN).emit('product-added', data.data);
    });

    socket.on('product-updated', (data) => {
      io.to(STACKHOLDER.ADMIN).emit('product-updated', data.data);
    });

    socket.on('delete-product', (id) => {
      io.to(STACKHOLDER.ADMIN).emit('delete-product', id);
    });

    socket.on('order-updated', async (data) => {
      const user = await findUser({ _id: data.user });
      if(!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found!')
      io.to(user.email).emit('order-updated', {
        _id: data._id,
        createdAt: data.createdAt,
        message: `Order-${data._id} has been ${data.status}!`,
        userId: user._id
      });
      io.to(STACKHOLDER.ADMIN).emit('order-updated', data);
    });

    socket.on('delete-order', async(id) => {
      const order = await findOrderService({ _id: id });
      if(!order) throw new ApiError(httpStatus.NOT_FOUND, 'Order not found!');
      io.to(order.user.email).emit('delete-order', data.id);
    });

    socket.on('delete-user', async (id) => {
      const user = await findUser({ _id: id })
      if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found!');
      const mailOptions = {
        from: mail_config.user,
        to: user.email,
        subject: 'Your account has been deleted!',
        html: template(`
      <h1>Hi ${user.firstName + ' ' + user.lastName},</h1>
                        <p>We recently observed some unauthorized activities from your account. So we decided to remove your account permanently.</p>
                        <!-- Action -->
                        <table class="body-action" align="center" width="100%" cellpadding="0" cellspacing="0" role="presentation">
                          <tr>
                            <td align="center">
                              <!-- Border based button
           https://litmus.com/blog/a-guide-to-bulletproof-buttons-in-email-design -->
                              <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
                                <tr>
                                  <td align="center">
                                    <a href="${client_url}/auth"  class="f-fallback button button--green" target="_blank">Create New Account</a>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                        
                        
      `)
      };

      const transport = generateEmailTransporter(
        mail_config.user,
        mail_config.password
      );

      await transport.sendMail(mailOptions);

    });


socket.on('like-dislike', async (data) => {
  try {
    const { reviewId, likes } = data;

    // Ensure likes cannot go below 0
    const updatedReview = await updateReviewService(reviewId, {
      $inc: { likes }
    });

    if (!updatedReview) {
      return socket.emit('error', { message: 'Review update failed!' });
    }

    if (updatedReview.likes < 0) {
      updatedReview.likes = 0;
      await updatedReview.save();
    }

    // Broadcast the updated likes count to all clients
    io.emit('like-dislike-update', updatedReview.likes);
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, 
      'An error occurred while updating the review.'
    );
  }
});




  });
};

module.exports = socket;
