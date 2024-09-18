import 'dotenv/config';
import { Bot, Context, GrammyError, HttpError, InputFile } from 'grammy';

if (!process.env.BOT_API_KEY) {
  throw new Error('BOT_API_KEY is not defined');
}
const bot = new Bot(process.env.BOT_API_KEY);

bot.api.setMyCommands([
  {
    command: 'start',
    description: 'Погнали',
  },
  {
    command: 'sdelaem',
    description: 'ДА СДЕЛАЕМ!',
  },
]);

const sendRandomVoice = async (ctx: Context) =>
  await ctx.replyWithVoice(
    new InputFile(`files/short${Math.floor(Math.random() * 11) + 1}.ogg`),
  );

bot.command('start', async (ctx) => await ctx.reply('Здарова мужик! Сделаем?'));
bot.command('sdelaem', sendRandomVoice);
bot.hears(/сделаем/i, sendRandomVoice);

bot.catch((err) => {
  const ctx = err.ctx;
  console.error(`Error while handling update ${ctx.update.update_id}:`);
  const e = err.error;

  if (e instanceof GrammyError) {
    console.error('Error in request:', e.description);
  } else if (e instanceof HttpError) {
    console.error('Could not contact Telegram:', e);
  } else {
    console.error('Unknown error:', e);
  }
});

bot.start();
