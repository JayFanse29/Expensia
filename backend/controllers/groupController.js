const Group = require('../models/group');
const User = require('../models/user');

exports.createGroup = async (req,res) => {
    try{
        const groupData = req.body;
        const newGroup = new Group({
            groupName: groupData.name,
            dateCreated: new Date(),
            owner: groupData.owner,
            members: groupData.members,
            pendingTransactions: [[0]]
        });

        const groupCreated = await newGroup.save();

        if(groupCreated)
        {
            const ownerID = groupData.owner;
            await User.findByIdAndUpdate(ownerID,{
                $push: {groups: groupCreated._id}
            });

            res.json({
                created: true,
                data: groupCreated
            })
        }
        else
        {
            res.json({
                created: false
            })
        }


    }
    catch(err){
        console.log(err);
    }
}

exports.getGroup = async (req,res) => {
    try{
        const groupId = req.query.groupId;

        const group = await Group.findById(groupId);
        if(group){
            res.json({
                exists: true,
                groupData: group
            });
        }
        else{
            res.json({
                exists: false
            })
        }
    }
    catch(err)
    {
        console.log(err);
    }
}

exports.deleteGroup = async (req,res) => {
    try{
        const groupId = req.query.groupId;

        const group = await Group.findById(groupId);

        const members = group.members;

        const updatePromises = members.map(memberId => {
            return User.findByIdAndUpdate(memberId, {
                $pull: {groups: groupId}
            });
        });
        await Promise.all(updatePromises);
        
        await Group.deleteOne({_id: groupId});

        res.json({
            message: "deleted successfully"
        })

    }
    catch(err){
        console.log(err);
    }


}