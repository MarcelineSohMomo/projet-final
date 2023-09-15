const { Categorie } = require("../models");

exports.createCategorie = async (req, res) => {
  try {
    const categorie = new Categorie(req.body);
    await categorie.save();
    res.status(201).json({ message: 'Categorie créée avec succès', data: categorie });
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la création de la catégorie', error });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Categorie.find();
    res.status(200).json({ message: 'Catégories récupérées avec succès', data: categories });
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la récupération des catégories', error });
  }
};

// Récupérer une catégorie par ID
exports.getCategorieById = async (req, res) => {
  try {
    const categorie = await Categorie.findById(req.params.id);
    if (!categorie) {
      res.status(404).json({ message: 'Catégorie introuvable' });
    } else {
      res.status(200).json({ message: 'Catégorie récupérée avec succès', data: categorie });
    }
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la récupération de la catégorie', error });
  }
};

// Mettre à jour une catégorie par ID
exports.updateCategorieById = async (req, res) => {
  try {
    const categorie = await Categorie.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!categorie) {
      res.status(404).json({ message: 'Catégorie introuvable' });
    } else {
      res.status(200).json({ message: 'Catégorie mise à jour avec succès', data: categorie });
    }
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la mise à jour de la catégorie', error });
  }
};

// Supprimer une catégorie par ID
exports.deleteCategorieById = async (req, res) => {
  try {
    const categorie = await Categorie.findByIdAndDelete(req.params.id);
    if (!categorie) {
      res.status(404).json({ message: 'Catégorie introuvable' });
    } else {
      res.status(200).json({ message: 'Catégorie supprimée avec succès' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la suppression de la catégorie', error });
  }
};

module.exports.addCategorie = async (data)=>{
  try {
      const categorie = new Categorie(data);
      await categorie.save();
      return console.log(`added '${categorie.name}' to categories collection`);
  } catch (error) {
      console.log(error)
  }
}