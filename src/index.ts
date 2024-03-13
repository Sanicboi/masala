import { AppDataSource } from "./data-source";
import Bot, { CallbackQuery, InputMedia, Message } from "node-telegram-bot-api";
import { User } from "./entity/User";
import { text } from "./text";
import { test } from "./test";
import fs from "fs";
import path from "path";
import { wait } from "./wait";

const bot = new Bot(
  /*process.env.TG_TOKEN*/ "7035011978:AAF8vnDTL-TN9u0fxTU2h7vK1xsnRPhg_ys",
  {
    polling: true,
  },
);

AppDataSource.initialize().then(async () => {
  const userRepo = await AppDataSource.getRepository(User);
  bot.onText(/\/start/, async (msg) => {
    let user = await userRepo.findOneBy({id: String(msg.from.id)});
    if (!user) {
      user = new User();
      user.username = msg.from.username;
      user.id = String(msg.from.id);
      await userRepo.save(user);
    }
    await wait(0.5);
    bot.sendMessage(msg.from.id, text("start.txt"), {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Адрес",
              callback_data: "address",
            },
          ],
          [
            {
              text: "Соцсети",
              callback_data: "networks",
            },
          ],
          [
            {
              text: "Служба поддержки",
              callback_data: "support",
            },
          ],
          [
            {
              text: "Обратный звонок",
              callback_data: "callback",
            },
          ],
          [
            {
              text: "Тест",
              callback_data: "test",
            },
          ],
          [
            {
              callback_data: "about",
              text: "О студии",
            },
          ],
          [
            {
              callback_data: "masters",
              text: "Мастера",
            },
          ],
          [
            {
              text: "Отзывы",
              callback_data: "reviews",
            },
          ],
          [
            {
              text: "Запись на прием",
              callback_data: "choose-time",
            },
          ],
        ],
      },
    });
  });

  bot.on("callback_query", async (q) => {
    const user = await userRepo.findOneBy({ id: String(q.from.id) });
    console.log(q.data);
    console.log(user.lastQuery);
    if (q.data === "about") {
      await wait(0.5);
      await bot.sendMessage(q.from.id, q.from.first_name + text("about.txt"), {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Да, хотел бы",
                callback_data: "program-y",
              },
            ],
            [
              {
                text: "Нет, не хочу",
                callback_data: "program-n",
              },
            ],
            [
              {
                text: "Уже получил(а)",
                callback_data: "program-a",
              },
            ],
          ],
        },
      });
    } else if (
      q.data === "test" ||
      q.data === "program-y" ||
      q.data === "program-n"
    ) {
      if (user.complete) {
        await wait(0.5);
        await bot.sendMessage(q.from.id, "Итак, начнем!", {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "Пройти тест",
                  callback_data: "do",
                },
              ],
              [
                {
                  text: "Не проходить",
                  callback_data: "dont",
                },
              ],
            ],
          },
        });
        return;
      }
      const img: Buffer = fs.readFileSync(
        path.join(__dirname, "img", "massage.png"),
      );
      await wait(0.5);
      await bot.sendPhoto(q.from.id, img, {
        caption: text("test.txt"),
      });
      await wait(1);
      await bot.sendMessage(q.from.id, text("test-2.txt"), {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Супер!",
                callback_data: "super",
              },
            ],
          ],
        },
      });
    } else if (q.data === "program-a") {
      await wait(0.5);
      await bot.sendMessage(q.from.id, "Отлично!");
    } else if (q.data === "address") {
      await wait(0.5);
      await bot.sendMessage(
        q.from.id,
        "📍Наш адрес: [Мебельная д47 к1](https://yandex.ru/navi/-/CCUNjBd2TA)",
        {
          parse_mode: "MarkdownV2",
        },
      );
    } else if (q.data === "networks") {
      await wait(0.5);
      await bot.sendMessage(q.from.id, text("networks.md"), {
        parse_mode: "MarkdownV2",
      });
    } else if (q.data === "support") {
      await wait(0.5);
      await bot.sendMessage(q.from.id, "✏️ тел.студии +7(921)907-54-09");
    } else if (q.data === "callback") {
      await wait(0.5);
      await bot.sendMessage(q.from.id, text("callback.txt"));
      user.waitingFor = "phone";
      await userRepo.save(user);
    } else if (q.data === "reviews") {
      const links = [
        "https://ibb.co/M2XML38",
        "https://ibb.co/Snj421S",
        "https://ibb.co/8rDjRgm",
        "https://ibb.co/Qm3g8FB",
        "https://ibb.co/zVpwsXq",
        "https://ibb.co/WGYL7th",
        "https://ibb.co/DDSgDFv",
      ];
      let media: InputMedia[] = [];
      links.forEach((l) => {
        media.push({
          media: l,
          type: "photo",
        });
      });
      await bot.sendMediaGroup(q.from.id, media);
    } else if (q.data === "choose-time") {
      await wait(0.5);
      await bot.sendMessage(q.from.id, text("address.txt"));
      user.waitingFor = "address";
      await userRepo.save(user);
    }

    test(bot, userRepo,q);



  });



  bot.onText(/./, async (msg) => {
    const user = await userRepo.findOneBy({ id: String(msg.from.id) });
    if (user && user.waitingFor === "phone") {
      user.waitingFor = "none";
      await userRepo.save(user);
      await bot.sendMessage(
        msg.from.id,
        "Должно быть сообщение админу, телефон: " + msg.text,
      );
    } else if (user && user.waitingFor === "age" && /^[0-9]+$/.test(msg.text)) {
      user.waitingFor = "none";
      user.age = +msg.text;
      await userRepo.save(user);
      await wait(0.5);
      await bot.sendMessage(msg.from.id, "Укажите пол", {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Муж",
                callback_data: "male",
              },
              {
                text: "Жен",
                callback_data: "female",
              },
            ],
          ],
        },
      });
    } else if (user && user.waitingFor === "address") {
      user.waitingFor = "none";
      await userRepo.save(user);
      await wait(0.5);
      await bot.sendMessage(
        msg.from.id,
        "Записал. В ближайшее время с вами свяжется наш менеджер и проконсультирует по визиту 🩷",
      );
      await bot.sendMessage(msg.from.id, `СООБЩЕНИЕ АДМИНУ: ${msg.text}`);
    } else if (user && user.waitingFor === "tellMore") {
      user.waitingFor = "none";
      user.tellMore += `${user.tellMoreQuery}: ${msg.text}\n`;
      await userRepo.save(user);
      if (user.tellMoreQuery === "Травмы") {
        await bot.sendMessage(
          msg.from.id,
          "Есть ли у вас противопоказания к массажу?",
          {
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: "Да",
                    callback_data: "against-y",
                  },
                  {
                    text: "Нет",
                    callback_data: "against-n",
                  },
                  {
                    text: "Назад",
                    callback_data: user.lastQuery,
                  },
                ],
              ],
            },
          },
        );
      } else if (user.tellMoreQuery === "Противопоказания") {
        await bot.sendMessage(
          msg.from.id,
          "Есть ли у вас хронические заболевания?",
          {
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: "Да",
                    callback_data: "chron-y",
                  },
                  {
                    text: "Нет",
                    callback_data: "chron-n",
                  },
                  {
                    text: "Назад",
                    callback_data: user.lastQuery,
                  },
                ],
              ],
            },
          },
        );
      } else if (user.tellMoreQuery === "Опыт") {
        await bot.sendMessage(
          msg.from.id,
          "Какой цели ты бы хотел достичь через массаж?",
          {
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: "Улучшение физической формы или восстановление",
                    callback_data: "recover",
                  },
                ],
                [
                  {
                    text: "Уход за кожей",
                    callback_data: "skincare",
                  },
                ],
                [
                  {
                    text: "Расслабление и снятие стресса",
                    callback_data: "relief",
                  },
                ],
                [
                  {
                    text: "Назад",
                    callback_data: user.lastQuery,
                  },
                ],
              ],
            },
          },
        );
      } else if (user.tellMoreQuery === "Цель") {
        await bot.sendMessage(
          msg.from.id,
          "На основе ваших ответов я бы предложил классический массаж",
        );
        await bot.sendMessage(
          msg.from.id,
          "Ну что, готовы прийти к нам на визит?",
          {
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: "Да, давайте выберем время",
                    callback_data: "choose-time",
                  },
                ],
                [
                  {
                    text: "Нет, еще не готов",
                    callback_data: "not-ready-yet",
                  },
                ],
              ],
            },
          },
        );
      } else if (user.tellMoreQuery === "Кожа") {
        user.skinIssue = "other";
        await userRepo.save(user);
        await bot.sendMessage(
          msg.from.id,
          "Как бы вы оценили состояние кожи от 1-5?",
          {
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: "1",
                    callback_data: "skin-1",
                  },
                  {
                    text: "2",
                    callback_data: "skin-2",
                  },
                ],
                [
                  {
                    text: "3",
                    callback_data: "skin-3",
                  },
                  {
                    text: "4",
                    callback_data: "skin-4",
                  },
                  {
                    text: "5",
                    callback_data: "skin-5",
                  },
                ],
                [
                  {
                    text: "Назад",
                    callback_data: user.lastQuery,
                  },
                ],
              ],
            },
          },
        );
      }
      
    }
  });

  
});
