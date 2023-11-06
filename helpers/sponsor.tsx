
import { sampleSize } from 'lodash';

interface Sponsor {
  name: string;
  logo: string;
  landingImage: string;
  link: string;
  slogan: string;
}

const sponsors: Sponsor[] = [
  {
    name: 'Bytebase',
    logo: 'https://res.cloudinary.com/dwdb9tvii/image/upload/v1699219317/mw9knwcfdwkkif7ergtf.webp',
    landingImage: 'https://res.cloudinary.com/dwdb9tvii/image/upload/v1699219874/zqbpk6e4s6fnhiaz9kl6.webp',
    link: 'https://bytebase.com?utm_source=star-history',
    slogan:
      'Database DevOps and CI/CD for MySQL, PG, Oracle, SQL Server, Snowflake, CK, Mongo, Redis',
  },
  {
    name: 'Dify',
    logo: 'https://res.cloudinary.com/dwdb9tvii/image/upload/v1699220066/latfhualqt6b35ascm8z.webp',
    landingImage: 'https://res.cloudinary.com/dwdb9tvii/image/upload/v1699220444/hz0bnvp2vkuxxtm97q8c.webp',
    link: 'https://dify.ai/?utm_source=star-history',
    slogan: 'Create an AI app in minutes and integrate LLM into your app for continuous improvement',
  },
  {
    name: 'GPTBots',
    logo: 'https://res.cloudinary.com/dwdb9tvii/image/upload/v1699220862/yzt4uyxsz0hodqnnfx7x.webp',
    landingImage: 'https://res.cloudinary.com/dwdb9tvii/image/upload/v1699221231/tuqk4h7pcz4lt0yud5e7.webp',
    link: 'https://www.gptbots.ai?refer=star-history',
    slogan:
      'Seamlessly connects LLM with enterprise data and services to build usable AI Bot services for business scenarios.',
  },
];

export const randomSponsors = sampleSize(sponsors, sponsors.length);