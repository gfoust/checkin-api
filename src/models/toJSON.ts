
export default {
  getters: false,
  virtuals: false,
  transform: (doc: unknown, obj: { id: any, _id: unknown, __v: unknown }, options: unknown) => {
    obj.id = obj._id;
    delete obj._id;
    delete obj.__v;
    return obj;
  },
};
