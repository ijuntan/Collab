const router = require('express').Router()

const documentController = require('../controllers/documentController')
const projectController = require('../controllers/projectController')

router.get('/', (req, res) => {
    res.send({
        message: 'im in project'
    })
})
router.get('/projects/:id', projectController.getProjects)
router.get('/:id', projectController.getProject)
router.post('/', projectController.createProject)
router.post('/document', documentController.createDocument)
router.delete('/:id', projectController.deleteProject)
router.delete('/document/:id', documentController.deleteDocument)
router.patch('/:id', projectController.updateProject)
router.patch('/addlink/:id', projectController.addLinkToProject)
router.patch('/deletelink/:id', projectController.deleteLinkFromProject)
module.exports = router