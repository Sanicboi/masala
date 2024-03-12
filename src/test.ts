import Bot, { InputMedia } from 'node-telegram-bot-api';
import { text } from './text';
import { Repository } from 'typeorm';
import { User } from './entity/User';
import fs from 'fs';
import path from 'path';
import { wait } from './wait';


export const test = (bot: Bot, repo: Repository<User>) => {
    bot.on('callback_query', async (q) => {
        const user = await repo.findOneBy({id: String(q.from.id)});

        if (q.data === 'super') {
            const img = fs.readFileSync(path.join(__dirname, 'img', 'about-me.png'));
            await wait(0.5);
            await bot.sendPhoto(q.from.id, img, {
                caption: text('about-me.txt'),
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: 'Расскажи подробнее!)',
                                callback_data: 'tell-more'
                            }
                        ]
                    ]
                }
            })
        } else if (q.data === 'tell-more') {
            const img = fs.readFileSync(path.join(__dirname, 'img', 'individual.png'));
            await wait(0.5);
            await bot.sendPhoto(q.from.id, img,{
                caption:
            text('massage.txt')});
            await wait(2);
            await bot.sendMessage(q.from.id, text('problem.txt'));
            await wait(2);
            await bot.sendMessage(q.from.id, '☀️ Получить целенаправленный подход, сосредоточенный на их специфических проблемах и целях');
            await wait(2);
            await bot.sendMessage(q.from.id, '☀️ Получить безопасное обслуживание, благодаря учету индивидуальных особенностей и противопоказаний');
            await wait(2);
            await bot.sendMessage(q.from.id, '☀️ Повысить эффективность результатов за счет тщательно подобранных техник и регулярных сеансов');
            await wait(2);
            await bot.sendMessage(q.from.id, '☀️ Получить целостный подход, включающий массаж и сопутствующие практики для улучшения общего благополучия', {
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: 'Интересно!)',
                                callback_data: 'interesting'
                            }
                        ]
                    ]
                }
            });
        } else if (q.data === 'interesting') {  
            const links = [
                'https://ibb.co/M2XML38',
                'https://ibb.co/Snj421S',
                'https://ibb.co/8rDjRgm',
                'https://ibb.co/Qm3g8FB',
                'https://ibb.co/zVpwsXq',
                'https://ibb.co/WGYL7th',
                'https://ibb.co/DDSgDFv',
            ];
            let media: InputMedia[] = [];
            links.forEach(l => {
                media.push({
                    media: l,
                    type: 'photo',
                });
            })
            await bot.sendMediaGroup(q.from.id, media);
            await wait(3);
            await bot.sendMessage(q.from.id, text('reviews.txt'), {
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: 'Конечно, идем дальше!)',
                                callback_data: 'next'
                            }
                        ]
                    ]
                }
            })
        } else if (q.data === 'next') {
            const img = fs.readFileSync(path.join(__dirname, 'img', 'act.png'));
            await wait(0.5);
            await bot.sendPhoto(q.from.id, img, {
                caption: text('act.txt')
            });
            await wait(1);
            await bot.sendMessage(q.from.id, text('act-2.txt'), {
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                callback_data: 'subscribed',
                                text: 'Подписался!!'
                            }
                        ]
                    ]
                }
            });
        } else if (q.data === 'subscribed') {
            user.complete = true;
            await repo.save(user);
            await bot.sendMessage(q.from.id, 'Теперь будем держаться вместе');
            await wait(1);
            await bot.sendMessage(q.from.id, 'Итак, начнем!', {
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: 'Пройти тест',
                                callback_data: 'do'
                            }
                        ],
                        [
                            {
                                text: 'Не проходить',
                                callback_data: 'dont'
                            }
                        ]
                    ]
                }
            })
        } else if (q.data === 'dont') {
            await wait(0.5);
            await bot.sendMessage(q.from.id, 'Понял Вас. Предлагаю тогда воспользоваться любой другой моей функцией', {
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: 'Адрес',
                                callback_data: 'address',
                            }
                        ],
                        [
                            {
                                text: 'Соцсети',
                                callback_data: 'networks'
                            }
                        ],
                        [
                            {
                                text: 'Служба поддержки',
                                callback_data: 'support'
                            }
                        ],
                        [
                            {
                                text: 'Обратный звонок',
                                callback_data: 'callback'
                            }
                        ],
                        [
                            {
                                text: 'Тест',
                                callback_data: 'test'
                            }
                        ],
                        [
                            {
                                callback_data: 'about',
                                text: 'О студии'
                            }
                        ],
                        [
                            {
                                callback_data: 'masters',
                                text: 'Мастера'
                            }
                        ],
                        [
                            {
                                text: 'Отзывы',
                                callback_data: 'reviews'
                            }
                        ],
                        [
                            {
                                text: 'Запись на прием',
                                callback_data: 'book'
                            }
                        ]
                    ]
                }
            })
        } else if (q.data === 'do') {
            user.waitingFor = 'age';
            await repo.save(user);
            await wait(0.5);
            await bot.sendMessage(q.from.id, 'Напишите ваш возраст');
        } else if (q.data === 'male' || q.data === 'female') {
            user.sex = q.data;
            await repo.save(user);
            await bot.sendMessage(q.from.id, 'Записал');
            await wait(1);
            await bot.sendMessage(q.from.id, 'Были ли у вас травмы тела?', {
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: 'Да',
                                callback_data: 'injury-y'
                            },
                            {
                                text: 'Нет',
                                callback_data: 'injury-n'
                            }
                        ]
                    ]
                }
            });
        } else if (q.data.startsWith('injury')) {
            await bot.sendMessage(q.from.id, 'Записал');
            await wait(1);
            if (q.data === 'injury-y') {
                user.waitingFor = 'tellMore';
                user.tellMoreQuery = 'Травмы';
                await repo.save(user);
                await bot.sendMessage(q.from.id, 'Расскажите подробнее'); 

            } else {
            await bot.sendMessage(q.from.id, 'Есть ли у вас противопоказания к массажу?', {
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: 'Да',
                                callback_data: 'against-y'
                            },
                            {
                                text: 'Нет',
                                callback_data: 'against-n'
                            },
                            {
                                text: 'Назад',
                                callback_data: user.lastQuery
                            }
                        ]
                    ]
                }
            });
        }
        } else if (q.data.startsWith('against')) {
            await bot.sendMessage(q.from.id, 'Записал');
            await wait(1);
            if (q.data === 'against-y'){
                user.waitingFor = 'tellMore';
                user.tellMoreQuery = 'Противопоказания';
                await repo.save(user);
                await bot.sendMessage(q.from.id, 'Расскажите подробнее');
            } else {
                await bot.sendMessage(q.from.id, 'Есть ли у вас хронические заболевания?', {
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {
                                    text: 'Да',
                                    callback_data: 'chron-y'
                                },
                                {
                                    text: 'Нет',
                                    callback_data: 'chron-n'
                                },
                                {
                                    text: 'Назад',
                                    callback_data: user.lastQuery
                                }
                            ]
                        ]
                    }
                });
            }
        } else if (q.data.startsWith('chron')) {
                await bot.sendMessage(q.from.id, 'Записал');
                await wait(1);
                await bot.sendMessage(q.from.id, 'Был ли уже опыт массажа?', {
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {
                                    text: 'Да',
                                    callback_data: 'exp-y'
                                },
                                {
                                    text: 'Нет',
                                    callback_data: 'exp-n'
                                },
                                {
                                    text: 'Назад',
                                    callback_data: user.lastQuery
                                }
                            ]
                        ]
                    }
                });
            
            
        } else if (q.data.startsWith('exp')) {
            await bot.sendMessage(q.from.id, 'Записал');
            await wait(1);
            if (q.data.startsWith('exp-y')) {
                user.waitingFor = 'tellMore';
                user.tellMoreQuery = 'Опыт';
                await repo.save(user);
                await bot.sendMessage(q.from.id, 'расскажите подробнее');
            } else {
                await bot.sendMessage(q.from.id, 'Какой цели ты бы хотел достичь через массаж?', {
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {
                                    text: 'Улучшение физической формы или восстановление',
                                    callback_data: 'recover'
                                }
                            ],
                            [
                                {
                                    text: 'Уход за кожей',
                                    callback_data: 'skincare'
                                }
                            ],
                            [
                                {
                                    text: 'Расслабление и снятие стресса',
                                    callback_data: 'relief'
                                }
                            ],
                            [
                                {
                                    text: 'Другое',
                                    callback_data: 'result-other'
                                }
                            ],
                            [
                                {
                                    text: 'Назад',
                                    callback_data: user.lastQuery
                                }
                            ]
                        ]
                    }
                });
            }
            
        } else if (q.data === 'recover') {
            await wait(1);
            await bot.sendMessage(q.from.id, 'Как часто вы занимаетесь спортом?', {
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: 'Почти каждый день',
                                callback_data: 'sport-d'
                            }
                        ],
                        [
                            {
                                text: 'Иногда, несколько раз в неделю',
                                callback_data: 'sport-w'
                            }
                        ],
                        [
                            {
                                text: 'Редко или вообще не занимаюсь',
                                callback_data: 'sport-r'
                            }
                        ],
                        [
                            {
                                text: 'Назад',
                                callback_data: user.lastQuery
                            }
                        ]
                    ]
                }
            })
        } else if (q.data === 'sport-r') {
            user.sport = 'r';
            await repo.save(user);
            await wait(1);
            await bot.sendMessage(q.from.id, text('why.txt'), {
                reply_markup: {
                    inline_keyboard: [
                        [{
                            text: 'Для решения конкретной проблемы',
                            callback_data: 'problem-c'
                        }],
                        [
                            {
                                text: 'Для улучшения общего самочувствия',
                                callback_data: 'problem-o'
                            }
                        ],
                        [
                            {
                                text: 'Назад',
                                callback_data: user.lastQuery
                            }
                        ]
                    ]
                }
            })
        } else if (q.data === 'problem-c') {
            await wait(1);
            await bot.sendMessage(q.from.id, 'Какие проблемы вы бы хотели решить?', {
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: 'Болевые ощущения в определенной области',
                                callback_data: 'issue-p'
                            }
                        ],
                        [
                            {
                                text: 'Чувство усталости',
                                callback_data: 'issue-t'
                            }
                        ],
                        [
                            {
                                text: 'Восстановление жизненной энергии',
                                callback_data: 'issue-e'
                            }
                        ],
                        [
                            {
                                text: 'Целлюлит или отеки',
                                callback_data: 'issue-s'
                            }
                        ],
                        [
                            {
                                text: 'Назад',
                                callback_data: user.lastQuery
                            }
                        ]
                    ]
                }
            })
        } else if (q.data.startsWith('issue') && q.data !== 'issue-e' && q.data !== 'issue-t') {
            switch (q.data) {
                case 'issue-s':
                    user.sportIssue = 's';
                    break;
                case 'issue-t':
                    user.sportIssue = 't';
                    break;
                case 'issue-e':
                    user.sportIssue = 'e';
                    break;
                case 'issue-p':
                    user.sportIssue = 'p';
                    break;
            }
            await repo.save(user);
            if (q.data === 'issue-p') {
                const img = fs.readFileSync(path.join(__dirname, 'img', 'muscles.jpg'));
                await wait(0.5);
                await bot.sendPhoto(q.from.id, img, {
                    caption: 'В каких группах мышц ты чувствуешь напряжение?',
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {
                                    callback_data: 'pain-1',
                                    text: '1-3, 10-11'
                                },
                            ],
                            [
                                {
                                    callback_data: 'pain-2',
                                    text: '4-6'
                                }
                            ],
                            [
                                {
                                    callback_data: 'pain-3',
                                    text: '7-9, 15-17'
                                },
                            ],
                            [
                                {
                                    callback_data: 'pain-4',
                                    text: '12-14'
                                }
                            ],
                            [
                                {
                                    text: 'Назад',
                                    callback_data: user.lastQuery
                                }
                            ]
                        ]
                    }
                });
            }
        } else if (q.data.startsWith('pain') || q.data === 'issue-t' || q.data === 'issue-e') {
            switch (q.data) {
                case 'issue-s':
                    user.sportIssue = 's';
                    break;
                case 'issue-t':
                    user.sportIssue = 't';
                    break;
                case 'issue-e':
                    user.sportIssue = 'e';
                    break;
                case 'issue-p':
                    user.sportIssue = 'p';
                    break;
            }
            await repo.save(user);
            if (q.data.startsWith('pain')) {
                user.muscleGroup = Number(q.data.at(5));
                await repo.save(user);
            }
            await wait(1);
            await bot.sendMessage(q.from.id, 'Оцени боль/напряжение по 5 бальной шкале', {
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                callback_data: 'scale-1',
                                text: '1'
                            },
                            {
                                callback_data: 'scale-2',
                                text: '2'
                            }
                        ],
                        [
                            {
                                callback_data: 'scale-3',
                                text: '3'
                            },
                            {
                                callback_data: 'scale-4',
                                text: '4'
                            },
                            {
                                callback_data: 'scale-5',
                                text: '5'
                            }
                        ],
                        [
                            {
                                text: 'Назад',
                                callback_data: user.lastQuery
                            }
                        ]
                    ]
                }
            });
        } else if (q.data.startsWith('scale') || q.data == 'issue-s') {
            if (q.data.startsWith('scale')) {
                user.painScale = Number(q.data.at(6));
                await repo.save(user);
            }
            let result: string = 'На основе ваших ответов, я бы предложил ';
            if (user.sport === 'd') {
                result += 'Спортивный массаж';
            }  else if (user.sportIssue === 'p') {
                result += 'Рефлекторный массаж'
            } else if (user.sportIssue === 's') {
                result += 'Антицеллюлитный массаж';
            } else { 
                result += 'Массаж ШВЗ';
            }
            await bot.sendMessage(q.from.id, result);
            await wait(2);
            await bot.sendMessage(q.from.id, 'Ну что, готовы прийти к нам на визит?', {
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: 'Да, давайте выберем время',
                                callback_data: 'choose-time'
                            }
                        ],
                        [
                            {
                                text: 'Нет, еще не готов',
                                callback_data: 'not-ready-yet'
                            }
                        ]
                    ]
                }
            });
        } else if (q.data === 'sport-d' || q.data === 'sport-w') {
            switch (q.data) {
                case 'sport-d':
                    user.sport = 'd';
                    break;
                case 'sport-w':
                    user.sport = 'w';
                    break;
            }
            await repo.save(user);
            const img = fs.readFileSync(path.join(__dirname, 'img', 'muscles.jpg'));
                await wait(0.5);
                await bot.sendPhoto(q.from.id, img, {
                    caption: 'В каких группах мышц ты чувствуешь напряжение?',
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {
                                    callback_data: 'pain-1',
                                    text: '1-3, 10-11'
                                },
                            ],
                            [
                                {
                                    callback_data: 'pain-2',
                                    text: '4-6'
                                }
                            ],
                            [
                                {
                                    callback_data: 'pain-3',
                                    text: '7-9, 15-17'
                                },
                            ],
                            [
                                {
                                    callback_data: 'pain-4',
                                    text: '12-14'
                                }
                            ],
                            [
                                {
                                    text: 'Назад',
                                    callback_data: user.lastQuery
                                }
                            ]
                        ]
                    }
            });
        }

        if (q.data === 'skincare') {
            await wait(1);
            await bot.sendMessage(q.from.id, 'Сузим круг. Выбери более конкретную цель', {
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: 'Улучшение состояния кожи',
                                callback_data: 'improve-skin'
                            },
                        ],
                        [
                            {
                                text: 'Увядающая кожа, морщины',
                                callback_data: 'fading-skin'
                            }
                        ],
                        [
                            {
                                text: 'Целлюлит или отеки',
                                callback_data: 'swelling'
                            }
                        ],
                        [
                            {
                                text: 'Нужна детоксикация и улучшение цвета лиц',
                                callback_data: 'detox'
                            }
                        ],
                        [
                            {
                                text: 'Назад',
                                callback_data: user.lastQuery
                            }
                        ]
                    ]
                }
            })
        } else if (q.data === 'detox' || q.data === 'swelling' || q.data === 'fading-skin' || q.data === 'improve-skin') {
            user.skinIssue = q.data;
            await repo.save(user);

            await bot.sendMessage(q.from.id, 'Записал');
            await wait(1);
            await bot.sendMessage(q.from.id, 'Как бы вы оценили состояние кожи от 1-5?', {
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: '1',
                                callback_data: 'skin-1'
                            },
                            {
                                text: '2',
                                callback_data: 'skin-2'
                            },
                        ],
                        [
                            {
                                text: '3',
                                callback_data: 'skin-3'
                            },
                            {
                                text: '4',
                                callback_data: 'skin-4'
                            },
                            {
                                text: '5',
                                callback_data: 'skin-5'
                            },
                        ],
                        [
                            {
                                text: 'Назад',
                                callback_data: user.lastQuery
                            }
                        ]
                    ]
                }
            });
        } else if (q.data.startsWith('skin')) {
            user.skinState = Number(q.data.at(5));
            await repo.save(user);
            await bot.sendMessage(q.from.id, 'Записал');
            await wait(1);
            await bot.sendMessage(q.from.id, 'Как бы вы оценили вашу кожу?', {
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: 'Нормальная',
                                callback_data: 'normal-skin'
                            }
                        ],
                        [
                            {
                                text: 'Сухая',
                                callback_data: 'dry-skin'
                            }
                        ],
                        [
                            {
                                text: 'Жирная',
                                callback_data: 'dry-skin'
                            }
                        ],
                        [
                            {
                                text: 'Сверхчувствительная',
                                callback_data: 'dry-skin'
                            }
                        ],
                        [
                            {
                                text: 'Назад',
                                callback_data: user.lastQuery
                            }
                        ]
                    ]
                }
            });
        } else if (q.data.endsWith('skin') && q.data !== 'improve-skin') {
            user.skinState2 = q.data;
            await repo.save(user);

            await bot.sendMessage(q.from.id, 'Записал');
            await wait(1);
            await bot.sendMessage(q.from.id, 'Как часто вы испытываете стресс?', {
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: 'Постоянно',
                                callback_data: 'stress-c'
                            }
                        ],
                        [
                            {
                                text: 'Часто',
                                callback_data: 'stress-o'
                            }
                        ],
                        [
                            {
                                text: 'Иногда',
                                callback_data: 'stress-s'
                            }
                        ],
                        [
                            {
                                text: 'Редко',
                                callback_data: 'stress-r'
                            }
                        ],
                        [
                            {
                                text: 'Назад',
                                callback_data: user.lastQuery
                            }
                        ]
                    ]
                }
            });
        } else if (q.data.startsWith('stress-')) {
            user.stress = q.data.at(7);
            await repo.save(user);

            let result = 'На основе ваших ответов я бы предложил ';
            if (user.skinIssue === 'swelling') {
                result += 'Антицеллюлитный массаж, а также обертывание глиной';
            } else if (user.skinIssue === 'improve-skin') {
                result += 'Антицеллюлитный массаж, обертывание глиной, спейслифтинг, хиромассаж лица, обертывание водорослями, а также медовый массаж';
            } else if (user.skinIssue === 'fading-skin') {
                result += 'Спейслифтинг, а также хиромассаж лиц';
            } else if (user.skinIssue === 'detox') {
                result += 'Обертывание водорослями, а также медовый массаж';
            }

            await bot.sendMessage(q.from.id, result);
            await wait(2);
            await bot.sendMessage(q.from.id, 'Ну что, готовы прийти к нам на визит?', {
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: 'Да, давайте выберем время',
                                callback_data: 'choose-time'
                            }
                        ],
                        [
                            {
                                text: 'Нет, еще не готов',
                                callback_data: 'not-ready-yet'
                            }
                        ]
                    ]
                }
            });
        }


        if (q.data === 'relief') {
            await wait(1);
            await bot.sendMessage(q.from.id, 'Сузим круг. Выбери более конкретную цель', {
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: 'Снижение стресса',
                                callback_data: 'stressIssue-s'
                            }
                        ],
                        [
                            {
                                text: 'Улучшение качества сна',
                                callback_data: 'stressIssue-i'
                            }
                        ],
                        [
                            {
                                text: 'Снятие мышечного напряжения',
                                callback_data: 'stressIssue-r'
                            }
                        ],
                        [
                            {
                                text: 'Повышение гибкости и диапазона движений',
                                callback_data: 'stressIssue-m'
                            }
                        ],
                        [
                            {
                                text: 'Назад',
                                callback_data: user.lastQuery
                            }
                        ]
                    ]
                }
            })
        } else if (q.data.startsWith('stressIssue-')) {
            user.stressIssue = q.data.at(12);
            await repo.save(user);
            await wait(1);
            await bot.sendMessage(q.from.id, 'Как часто вы испытываете стресс?', {
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: 'Постоянно',
                                callback_data: 'stressed-c'
                            }
                        ],
                        [
                            {
                                text: 'Часто',
                                callback_data: 'stressed-o'
                            }
                        ],
                        [
                            {
                                text: 'Иногда',
                                callback_data: 'stressed-s'
                            }
                        ],
                        [
                            {
                                text: 'Редко',
                                callback_data: 'stressed-r'
                            }
                        ],
                        [
                            {
                                text: 'Назад',
                                callback_data: user.lastQuery
                            }
                        ]
                    ]
                }
            });
        } else if (q.data.startsWith('stressed-')) {
            user.stress = q.data.substring(9);
            await repo.save(user);
            await wait(1);
            await bot.sendMessage(q.from.id, 'Оцените сейчас свое состояние от 1-5', {
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: '1',
                                callback_data: 'mental-1'
                            },
                            {
                                text: '2',
                                callback_data: 'mental-2'
                            },
                        ],
                        [
                            {
                                text: '3',
                                callback_data: 'mental-3'
                            },
                            {
                                text: '4',
                                callback_data: 'mental-4'
                            },
                            {
                                text: '5',
                                callback_data: 'mental-5'
                            },
                        ],
                        [
                            {
                                text: 'Назад',
                                callback_data: user.lastQuery
                            }
                        ]
                    ]
                }
            })
        } else if (q.data.startsWith('mental-')) {
            user.mental = Number(q.data.at(7));
            await repo.save(user);
            await bot.sendMessage(q.from.id, 'Записал');
            await wait(1);
            await bot.sendMessage(q.from.id, 'Чувствуете ли вы напряжение в теле?', {
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: 'Да, чувствую',
                                callback_data: 'mentalpain-y'
                            }
                        ],
                        [
                            {
                                text: 'Нет, не чувствую',
                                callback_data: 'mentalpain-n'
                            }
                        ],
                        [
                            {
                                text: 'Назад',
                                callback_data: user.lastQuery
                            }
                        ]
                    ]
                }
            });
        } else if (q.data.startsWith('mentalpain-')) {
            user.hasPain = q.data.at(11);
            await repo.save(user);

            if (user.hasPain === 'y') {
                const img = fs.readFileSync(path.join(__dirname, 'img', 'muscles.jpg'));
                await wait(0.5);
                await bot.sendPhoto(q.from.id, img, {
                    caption: 'В каких группах мышц ты чувствуешь напряжение?',
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {
                                    callback_data: 'mentalp-1',
                                    text: '1-3, 10-11'
                                },
                            ],
                            [
                                {
                                    callback_data: 'mentalp-2',
                                    text: '4-6'
                                }
                            ],
                            [
                                {
                                    callback_data: 'mentalp-3',
                                    text: '7-9, 15-17'
                                },
                            ],
                            [
                                {
                                    callback_data: 'mentalp-4',
                                    text: '12-14'
                                }
                            ],
                            [
                                {
                                    text: 'Назад',
                                    callback_data: user.lastQuery
                                }
                            ]
                        ]
                    }
                });
            } else {
                let result = 'На основе ваших ответов я бы предложил ';
                if (user.stressIssue === 's') {
                    result += 'Расслабляющий массаж';
                } else if (user.stressIssue === 'i') {
                    result += 'Рефлекторный массаж';
                } else if (user.stressIssue === 'r') {
                    result += 'Спортивный массаж';
                } else if (user.stressIssue === 'm') {
                    result += 'Тайский массаж';
                }

                await bot.sendMessage(q.from.id, result);
                await wait(1);
                await bot.sendMessage(q.from.id, 'Ну что, готовы прийти к нам на визит?', {
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {
                                    text: 'Да, давайте выберем время',
                                    callback_data: 'choose-time'
                                }
                            ],
                            [
                                {
                                    text: 'Отлично, давайте выберем время',
                                    callback_data: 'not-ready-yet'
                                }
                            ]
                        ]
                    }
                });
            }
        } else if (q.data.startsWith('mentalp-')) {
            user.muscleGroup = Number(q.data.at(8));
            await repo.save(user);
            await wait(1);
            await bot.sendMessage(q.from.id, 'Оцените напряжение от 1-5', {
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: '1',
                                callback_data: 'mentalscale-1',
                            },
                            {
                                text: '2',
                                callback_data: 'mentalscale-2',
                            },
                        ],
                        [
                            {
                                text: '3',
                                callback_data: 'mentalscale-3',
                            },
                            {
                                text: '4',
                                callback_data: 'mentalscale-4',
                            },
                            {
                                text: '5',
                                callback_data: 'mentalscale-5',
                            },
                        ],
                        [
                            {
                                text: 'Назад',
                                callback_data: user.lastQuery
                            }
                        ]
                    ]
                }
            })
        } else if (q.data.startsWith('mentalscale-')) {
            user.painScale = Number(q.data.at(12));
            await repo.save(user);

            await bot.sendMessage(q.from.id, 'На основе ваших ответов я бы предложил Спортивный массаж');
            await wait(2);
            await bot.sendMessage(q.from.id, 'Я предлагаю тебе сделать первый шаг к своему новому состоянию и записаться к нам на визит.', {
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: 'Да, давайте выберем время',
                                callback_data: 'choose-time'
                            }
                        ],
                        [
                            {
                                text: 'Нет, пока не готов',
                                callback_data: 'not-ready-yet'
                            }
                        ]
                    ]
                }
            });
        } else if (q.data === 'result-other') {
            user.waitingFor = 'tellMore';
            user.tellMoreQuery = 'Цель';
            await repo.save(user);
            await bot.sendMessage(q.from.id, 'Расскажите подробнее');
        }
        user.lastQuery = q.data;
        await repo.save(user);
    })
}