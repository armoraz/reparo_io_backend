const { Professional, Profession } = require("../db.js");

const getAllProfesional = async () => {

  const results = await Professional.findAll();
  return results;
};

const infoById = async (id) => {
  const profesionalId = await Professional.findOne({
    where: { id: id },
    include: [{ model: Profession, attributes: ["id", "name"] }],
  });
  let { professions } = profesionalId;
  let profes = professions ? professions.map((p) => p.name) : [];

  const prof = {
    id: profesionalId.id,
    firstName: profesionalId.firstName,
    lastName: profesionalId.lastName,
    profileImg: profesionalId.profileImg,
    reputation: profesionalId.reputation? profesionalId.reputation:"not available yet",
    professions: profes,
  };
  return prof;

};

function isStringOk(data) {
    if (typeof data !== "string")
      throw new Error(`INPUT_ERROR: ${data} is not a String`);
    if (data.trim() === "")
      throw new Error(`INPUT_ERROR: ${data} cannot be empty`);
  }
  
  function isArrayOk(data) {
    if (typeof data !== "object")
      throw new Error(`INPUT_ERROR: ${data} is not an Array`);
    //Se aceptan instrucciones vacias
  }


const postAProfesional = async (profesionalData) => {

  if (!profesionalData.firstName) {
    return { error: "Profesional must have at least a name" };
  }
  try {
    const newProfessional = await Professional.create(profesionalData);

    await Promise.all(
      profesionalData.professions.map(async (p) => {
        let profesion = {};
        // esto es para tomar ambos sean objetos o id de profesion
        isNaN(p)
          ? (profesion = await Profession.findOne({
              where: { name: `${p}` },


            }))
          : (profesion = await Profession.findByPk(p));

        newProfessional.addProfession(profesion);
      })
    );

    return newProfessional.dataValues;
  } catch (e) {
    return { error: e };
  }
};

module.exports = {
  getAllProfesional,
  postAProfesional,
  infoById,
};
