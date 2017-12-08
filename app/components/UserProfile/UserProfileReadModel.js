module.exports = class UserProfileReadModel {
  constructor(userDbModel) {
    this.id = userDbModel._id;
    this.name = `${userDbModel.firstname} ${userDbModel.lastname}`;
    this.emailAddress = userDbModel.email;
    this.allergens = userDbModel.allergens;
  }
}