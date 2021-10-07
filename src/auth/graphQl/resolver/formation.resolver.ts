
const Formation = require('../../models/formation.model.ts')

export const formationResolver = {
    Query: {
        formation: async (parent: any, args: any, context: any) => {
                try {
                    const {formationId} = args;
                    return await Formation.findById(formationId);
                } catch (error) {
                    console.error(error)
                }
        },
        formations: async (parent: any, args: any, context: any) => {
                try {
                    return await Formation.find();
                } catch (error) {
                    console.error(error);
            }
    },
    },
    Mutation: {
        createFormation: async (parent: any, args: any) => {
          const {name}= args;
          const existingFormation = await Formation.findOne({name:name})
          if(existingFormation){
              console.log("cette formation existe deja")
          }
          const formation =new Formation({
              name: name,
          })
          await formation.save();
          return formation;
        },
        updateUFormation: async (parent: any, args: any) => {
            try{
                const{id, name}=args;
                return Formation.findByIdAndUpdate(
                    id,{name},
                    {new: true}
                )
            }catch(error){
                console.log("une erreur lors de la mise a jour", error);
            }
        },
        deleteFormation: async (parent: any, args: any) => {
            const{id}=args;
             Formation.findByIdAndDelete(id, (err:Error, docs:any) => {
                if (err){console.log(err)}
                else{console.log("Deleted : ", docs);}
                }
            )
        }
    }
}