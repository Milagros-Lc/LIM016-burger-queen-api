const { Schema, model } = require("mongoose");
const rolSchema=new Schema(
  {

    admin: {
      type: Boolean,
      default: false,
    },
  }, {
    timestamps: true,
    versionKey: false,
  },
);

module.exports=model('Role', rolSchema)