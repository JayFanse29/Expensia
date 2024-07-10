const nodemailer = require('nodemailer');
const User = require("../models/user");
const Group = require("../models/group");
const jwt = require('jsonwebtoken');

exports.inviteMember = async (req, res) => {
    try {
        const inviteMember = req.body;
        const mail = inviteMember.mail;
        const groupId = inviteMember.group;

        const newUser = await User.findOne({ email: mail });
        if (!newUser) {
            res.json({
                message: "User is not registered with the app"
            })
        }
        else {

            const prevUser = await User.findOne({
                _id: newUser._id,
                groups: {
                    $in: [groupId]
                }
            });

            if (prevUser) {
                res.json({
                    message: "User is already in the group"
                });
            }
            else {
                const group = await Group.findById(groupId);
                const user = await User.findById(group.owner);

                const token = jwt.sign({ userId: newUser._id, groupId: groupId, groupName: group.groupName }, process.env.SECRET_KEY)

                const link = `http://localhost:3000/invitation?token=${token}&groupName=${group.groupName}`

                const mailOptions = {
                    from: 'expensia.official@gmail.com',
                    to: mail,
                    subject: "You've been invited!!",
                    html: `<p>Hey ${newUser.fname},<br>
                    You've been invited to join ${group.groupName}.</p>
                    <p>Group owner: ${user.fname} ${user.lname}</p>

                        <a href="${link}"><button>Accept Invitation</button></a>`
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log(error);
                        return res.status(500).json({
                            message: error.toString()
                        });
                    }
                    else {
                        res.json({
                            message: "Invited successfully"
                        });
                    }
                });
            }
        }

    } catch (err) {
        console.log(err);
    }
}

const transporter = nodemailer.createTransport({
    service: 'Gmail', // or another email service
    auth: {
        user: process.env.MAIL,
        pass: process.env.PASSWORD
    }
});

exports.acceptInvitation = async (req, res) => {
    try {
        console.log(req.tokenData);

        const groupId = req.tokenData.groupId;
        const userId = req.tokenData.userId;
        const groupName = req.tokenData.groupName;

        const prevUser = await User.findOne({
            _id: userId,
            groups: {
                $in: [groupId]
            }
        });

        if (prevUser) {
            res.json({
                message: "You've already joined the group",
                exec: true
            });
        }
        else {
            const user = await User.findByIdAndUpdate(userId, {
                $push: { groups: groupId }
            });

            const group = await Group.findByIdAndUpdate(groupId, {
                $push: { members: userId } },
                {new: true});

            const members = group.members.length-1;
            const newMembers = members+1;
            const pendingTransactions = group.pendingTransactions;

            // Define the new dimensions for the new 2D array
            const newPendingTransactions = Array.from({ length: newMembers }, () => Array(newMembers).fill(0));

            // Initialize totalPendingTransactions with the new dimensions
            const totalPendingTransactions = Array.from({ length: newMembers }, () => Array(newMembers).fill(0));

            // Add values from newPendingTransactions and pendingTransactions to totalPendingTransactions
            for (let i = 0; i < newMembers; i++) {
                for (let j = 0; j < newMembers; j++) {
                    totalPendingTransactions[i][j] = newPendingTransactions[i][j];
                    if (i < members && j < members) {
                        totalPendingTransactions[i][j] += pendingTransactions[i][j];
                    }
                }
            }

            console.log(totalPendingTransactions);

            const updateGroup = await Group.findByIdAndUpdate(groupId, {
                pendingTransactions: totalPendingTransactions
            })

            if (updateGroup && user) {
                res.json({
                    message: `Congratulations! You are now part of ${groupName}`,
                    exec: true
                });
            }
            else {
                res.json({
                    message: `Oops! your attempt failed. Please try again.`,
                    exec: false
                });
            }
        }

    }
    catch (err) {
        console.log(err)
    }
}