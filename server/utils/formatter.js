export const cleanMedicineName = (name) => {
  return name.replace(/\s\d+\s*(mg|ml|g|mcg|kg|l|mg\/ml|IU|units)$/i, '');
};