const { Router } = require("express");
const {
    getAllProfesional,
    postAProfesional,
    putProfesional,
    delProfesional,
    infoById,
} = require("../controllers/professional");
const router = Router();

router.get("/", (req, res, next) => {
    console.log("imhere");
    getAllProfesional().then((r) => res.send(r));
});

router.get("/:id", async (req, res, next) => {
    const { id } = req.params
    try {
        const profesionalId = await infoById(id)
        return res.status(200).send(profesionalId)
    } catch (error) {
        next(error)
    }
})

router.post("/", (req, res, next) => {
    const { body } = req;
    console.log(body, "aqui");
    postAProfesional(body).then((r) => console.log(r));
    res.send(body);
});

router.put('/:id', async (req, res, next)=>{
    const {id} = req.params;
    const { body } = req;
    putProfesional(body,id).then((r) => console.log(r));
    res.send(body);
});
router.delete('/:id', async (req,res,next)=>{
    const {id} = req.params;
    delProfesional(id).then((r) => console.log(r));
    res.send({message: "Professional deleted"});
});

module.exports = router;
