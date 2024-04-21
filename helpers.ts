import fs from "fs";

export const deleteFilesAsync = (files: string[]) => {
    for (let file of files) {
        fs.unlink(file, (err) => {
            if (err) {
                console.error(`Error when deleteing the file: ${file}`, err);
                return;
            }
            console.log(`File: ${file} has been deleted.`);
        });
    }
};