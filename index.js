const core = require('@actions/core');
const { minify } = require('minify');
const glob = require('glob');
const fs = require('node:fs/promises');
const path = require('path');

async function run() {
  try {
    const inputPath = core.getInput('path');
    const fileTypes = core.getInput('types'); // Expects: "js,css,html" or "js" or "css,html", etc.
    const singleFileType = core.getInput('type'); // Expects: "js" or "css" or "html"
    const fileListInput = core.getInput('file_list'); // Expects a comma-separated list, e.g., "file1.js,file2.css,dir/file3.html"
    const optionsInput = core.getInput('options');    // JSON string of minify options.
      
    let options = {};

    if (optionsInput) {
        try {
            options = JSON.parse(optionsInput);
        } catch (error) {
            core.setFailed(`Invalid options JSON: ${error.message}`);
            return;
        }
    }
      

    // --- File Gathering Logic ---
    let filesToMinify = [];

    if (fileListInput) {
      filesToMinify = fileListInput.split(',').map(f => f.trim()).filter(f => f !== '');
    } else if (inputPath) {
        // Determine if inputPath is a file or a directory
        const stats = await fs.stat(inputPath);
        if (stats.isFile())
        {
            filesToMinify = [inputPath];
        }
        else
        {
            // Use glob to get all files matching the type(s)
            const typeArray = fileTypes ? fileTypes.split(',').map(t => t.trim()) : (singleFileType ? [singleFileType] : ['js', 'css', 'html']);
            const globPatterns = typeArray.map(type => `${inputPath}/**/*.${type}`);  // e.g., ['src/**/*.js', 'src/**/*.css']
            for (const pattern of globPatterns) {
              const files = glob.sync(pattern);
              filesToMinify.push(...files);
            }
            filesToMinify = [...new Set(filesToMinify)]; // Remove duplicates

        }

    }
      else {
          core.setFailed("Either 'path' or 'file_list' must be provided.");
          return;
      }


    // --- Minification Logic ---
    for (const file of filesToMinify) {
        // Determine the output file name
      let parsedPath = path.parse(file);
      let outputFile = path.join(parsedPath.dir, `${parsedPath.name}.min${parsedPath.ext}`);


      try {
        // Determine file type for minify (if not using auto mode)
        let fileType = null;
        if (singleFileType) {
          fileType = singleFileType;
        } else if (fileTypes) {
            const ext = path.extname(file).substring(1); // Remove the '.'  e.g., ".js" -> "js"
            if (fileTypes.split(',').map(t => t.trim()).includes(ext)) {
                fileType = ext;
            }
        }

          const minifiedContent = await minify(file, options);  //options

        // Write the minified content to the output file
        await fs.writeFile(outputFile, minifiedContent, 'utf8');
        core.info(`Minified ${file} -> ${outputFile}`);

      } catch (error) {
        core.setFailed(`Error minifying ${file}: ${error.message}`);
        return; // Stop on error
      }
    }

    core.info('Minification complete.');

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();