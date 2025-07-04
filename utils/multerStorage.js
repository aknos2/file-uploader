import multer from 'multer';
export const upload = multer({ storage: multer.memoryStorage() });


// import multer from 'multer';
// import path from 'path';
// import fs from 'fs/promises';
// import prisma from '../lib/prisma.js'; 

// export const storage = multer.diskStorage({
//   destination: async (req, file, cb) => {
//     console.log('📁 Multer destination called');
    
//     // Access folderId from the form data
//     // Note: In multer, we need to parse it from the raw field data
//     let folderId = null;
//     let folderName = null;
    
//     // Try to get folderId from the request
//     // This is tricky because multer processes files before setting req.body
//     // We need to look at the raw field data
//     if (req.body && req.body.folderId) {
//       folderId = req.body.folderId;
//     }
    
//     console.log('📁 Raw folderId from form:', folderId);
    
//     // Handle empty strings
//     if (folderId === '' || folderId === 'undefined' || folderId === 'null') {
//       folderId = null;
//     }
    
//     // If we have a folderId, resolve the folder name
//     if (folderId) {
//       try {
//         const folder = await prisma.folder.findUnique({
//           where: { id: folderId }
//         });
        
//         if (folder) {
//           folderName = folder.name;
//           console.log('📁 Resolved folder name:', folderName);
//         } else {
//           console.log('📁 Folder not found for ID:', folderId);
//         }
//       } catch (error) {
//         console.error('📁 Error resolving folder:', error);
//       }
//     }
    
//     const uploadBase = 'uploads';
//     const uploadPath = folderName ? path.join(uploadBase, folderName) : uploadBase;
    
//     console.log('📁 Final upload path:', uploadPath);

//     try {
//       await fs.mkdir(uploadPath, { recursive: true });
//       console.log('📁 Directory ensured:', uploadPath);
      
//       // Store the resolved folder info for later use
//       req.resolvedFolderName = folderName;
//       req.resolvedFolderId = folderId;
      
//       cb(null, uploadPath);
//     } catch (err) {
//       console.error('📁 Error creating directory:', err);
//       cb(err);
//     }
//   },

//   filename: async (req, file, cb) => {
//     const folderName = req.resolvedFolderName;
//     const uploadBase = 'uploads';
//     const uploadPath = folderName ? path.join(uploadBase, folderName) : uploadBase;

//     const originalName = file.originalname;
//     const ext = path.extname(originalName);
//     const base = path.basename(originalName, ext);

//     let finalName = originalName;
//     let counter = 1;

//     console.log('📁 Determining filename for:', originalName);
//     console.log('📁 In directory:', uploadPath);

//     try {
//       // Handle duplicate filenames
//       while (true) {
//         const filePath = path.join(uploadPath, finalName);
//         try {
//           await fs.access(filePath);
//           // File exists, increment counter
//           finalName = `${base}(${counter})${ext}`;
//           counter++;
//         } catch {
//           // File doesn't exist, use this name
//           break;
//         }
//       }

//       console.log('📁 Final filename:', finalName);
//       cb(null, finalName);
//     } catch (err) {
//       console.error('📁 Error determining filename:', err);
//       cb(err);
//     }
//   }
// });

// // Alternative: Custom multer setup that handles field parsing first
// export const createSmartUpload = () => {
//   return multer({
//     storage,
//     fileFilter: (req, file, cb) => {
//       console.log('📁 File filter - file:', file.originalname);
//       console.log('📁 File filter - req.body at this point:', req.body);
//       cb(null, true);
//     }
//   });
// };