rm -rf node_modules
npm --force cache clear
npm install discord.js axios @discordjs/builders @discordjs/rest discord-api-types
npm install dotenv --save

node deploy-commands.js
node index.js