/*
 * Grammar topics with their own area: relative clauses, wenn/als, während.
 * Each has choice questions, verb forms to type and (some) sentences to build.
 * They are practised on purpose, so the lesson setting does not hide them.
 */
import relative from '../data/relative.js';
import conditional from '../data/conditional.js';
import whileData from '../data/while.js';
import { grammarChoiceTask, sentenceTask, verbByDict, verbClozeTask, verbTags, TOPICS } from './grammar.js';
import { hash } from './common.js';

const MODES = { mix: 'Gemischt', choice: 'Auswahl', form: 'Form bilden', build: 'Satzbau' };

function topicArea({ id, prefix, title, icon, blurb, data, topics, mainTopic }) {
  const sections = ['choice', 'form', 'build'].filter((key) => data[key]?.length);
  return {
    id,
    title,
    group: 'gram',
    icon,
    blurb,
    ref: id,
    options: [
      { key: 'mode', label: 'Übungsart', choices: Object.fromEntries(Object.entries(MODES).filter(([key]) => key === 'mix' || sections.includes(key))), default: 'mix' },
      ...(topics.length > 1 ? [{ key: 'topic', label: 'Thema', choices: { '': 'Alle', ...Object.fromEntries(topics.map((t) => [t, TOPICS[t]])) }, default: '' }] : []),
    ],
    items(ctx) {
      const mode = ctx.opts.mode ?? 'mix';
      const topic = ctx.opts.topic || null;
      const wanted = (key) => mode === 'mix' || mode === key;
      const items = [];
      if (wanted('choice')) {
        for (const g of data.choice ?? []) {
          if (topic && g.t !== topic) continue;
          items.push({ id: `${prefix}:c:${hash(g.s + g.o[0])}`, lesson: g.l, tags: [`L${g.l}`, `gr:${g.t}`], g });
        }
      }
      if (wanted('form')) {
        for (const c of data.form ?? []) {
          const t = c.t ?? mainTopic;
          if ((topic && t !== topic) || !verbByDict[c.v]) continue;
          items.push({ id: `${prefix}:f:${hash(c.s + c.v)}`, lesson: c.l, tags: [`L${c.l}`, `gr:${t}`, ...verbTags(verbByDict[c.v], c.f)], c });
        }
      }
      if (wanted('build') && !topic) {
        for (const s of data.build ?? []) items.push({ id: `${prefix}:b:${hash(s.de + s.c.join(''))}`, lesson: s.l, tags: [`L${s.l}`, `gr:${mainTopic}`], s });
      }
      return items;
    },
    task(item, ctx) {
      if (item.g) return grammarChoiceTask(item.g, ctx);
      if (item.c) return verbClozeTask(item.c);
      return sentenceTask(item.s, ctx);
    },
  };
}

export const relativeArea = topicArea({
  id: 'relative',
  prefix: 'rel',
  title: 'Relativsätze',
  icon: 'link',
  blurb: 'めがねをかけているひと – Sätze vor dem Nomen (Lektion 22)',
  data: relative,
  topics: ['modify'],
  mainTopic: 'modify',
});

export const conditionalArea = topicArea({
  id: 'conditional',
  prefix: 'cond',
  title: 'Wenn & als',
  icon: 'swap',
  blurb: 'とき, と, たら, ば, なら, ても – und いくとき oder いったとき?',
  data: conditional,
  topics: ['toki', 'to-cond', 'tara', 'ba', 'nara', 'temo'],
  mainTopic: 'toki',
});

export const whileArea = topicArea({
  id: 'while',
  prefix: 'whl',
  title: 'Während',
  icon: 'hourglass',
  blurb: 'ながら, 〜あいだ, 〜あいだに, 〜ちゅう (Minna II)',
  data: whileData,
  topics: ['nagara', 'aida', 'aidani', 'chuu', 'toki'],
  mainTopic: 'nagara',
});
