import multer, { diskStorage } from 'multer';

const storage = multer.memoryStorage();

export const upload = multer({ storage: storage });

