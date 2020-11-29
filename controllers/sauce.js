const Sauce = require('../models/Sauce');
const fs = require('fs');

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: []
  });
  sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce enregistrée !'}))
    .catch(error => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => { res.status(200).json(sauce); })
    .catch((error) => { res.status(404).json({ error }); });
};

exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
    .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
          .catch(error => res.status(400).json({ error }));
        });
    })
    .catch(error => res.status(500).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => { res.status(200).json(sauces); })
    .catch((error) => { res.status(400).json({ error }); });
};

exports.reviewSauce = (req, res, next) => {
  const reqLike = req.body.like;
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      // ****************************************************************************
      console.log(sauce);
      let arrayOfUsersLiked = sauce.usersLiked;
      let arrayOfUsersDisliked = sauce.usersDisliked;
      let message;
      let likesCounter = sauce.likes;
      let dislikesCounter = sauce.dislikes;
      console.log("Fin des assignations");
      console.log("/Début de la logique ************************************/")
      if (reqLike == 0) {
        arrayOfUsersLiked.forEach((user, index) => {
          if (user === req.body.userId) {
            arrayOfUsersLiked.splice(index, 1);
            likesCounter--;
          }
        });
        arrayOfUsersDisliked.forEach((user, index) => {
          if (user === req.body.userId) {
            arrayOfUsersDisliked.splice(index, 1);
            dislikesCounter--;
          }
        });
        message = "Préférence retirée !";
      } else if (reqLike == 1) {
        likesCounter++;
        arrayOfUsersLiked.push(req.body.userId);
        message = "Vous aimez cette sauce !";
      } else {
        dislikesCounter++;
        arrayOfUsersDisliked.push(req.body.userId);
        message = "Vous n'aimez pas cette sauce !";
      }
      console.log("/Fin de la logique **************************************/")

      Sauce.updateOne({ _id: req.params.id }, { likes: likesCounter, dislikes: dislikesCounter, usersLiked: arrayOfUsersLiked, usersDisliked: arrayOfUsersDisliked })
        .then(() => res.status(200).json({ message: message }))
        .catch(error => res.status(400).json({ error }));

      // res.status(200).json({ message: "Sauce Liked !"});
      // *************************************************************************** 
    })
    .catch((error) => { res.status(404).json({ error }); });
};


/*
userId = req.body.userId
productId = req.params.id
*/

/*
  si LIKES && DISLIKES N'EXISTE PAS
    ALORS AJOUTER userId: chaîne & (likes || dislikes)
  SINON SI LIKES EXISTE
      je récupère 
  SINON ERREUR 418
*/