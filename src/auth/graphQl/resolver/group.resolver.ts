
const Group = require('../../models/group.model')

export const GroupResolver = {
    Query: {
        group: async (parent: any, args: any, context: any) => {
                try {
                    const {formationId} = args;
                    return await Group.findById(formationId);
                } catch (error) {
                    console.error(error)
                }
        },
        groups: async (parent: any, args: any, context: any) => {
                try {
                  return await Group.find({});
                  
                } catch (error) {
                    console.error(error);
            }
    },
    },
    Mutation: {
        createGroup: async (parent: any, args: any) => {
            try {
                const {name, isActive, formationId, userId} = args;
                const existingGroup = await Group.findOne({name:name})
                if(existingGroup){
                    const group =new Group({name: name,})
                    return {name:` erreur: ${group.name} éxiste deja `}
                }else{
                    const group =new Group({
                        name: name,
                        formationId: formationId,
                        userId:userId,
                        isActive:isActive || false
                    })
                    return group.save()
                }
            }catch (e) {
                console.error(e)
            }

        },
        deleteGroup: async (parent: any, args: any) => {
            const{id}=args;
            Group.findByIdAndDelete(id, (err:Error, docs:any) => {
                if (err){console.log(err)}
                else{console.log("Deleted : ", docs);}
                }
            )
        }
    }
}
