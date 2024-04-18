*This is the eighteenth issue of The Starlet List. If you want to prompt your open source project on star-history.com for free, please check out our [announcement](/blog/list-your-open-source-project).*

---

# Prisma ORM: Simplify Working and Interacting with Databases

## What is Prisma ORM?

Prisma ORM is a toolkit that makes it easy for developers to work with databases. It primarily supports three main workflows:

- **Data modeling**: Model your database schema in an intuitive and human-readable way.
- **Migrations**: Generate migration files and keep track of the history and evolution of your database schema.
- **Querying**: Query your database using a developer-friendly and type-safe API.

You can try out querying with Prisma ORM and learn about migration workflows in the [interactive Playground](https://playground.prisma.io/).

Prisma ORM supports the most popular SQL databases as well as MongoDB, see the full list of supported databases [here](https://www.prisma.io/docs/orm/reference/supported-databases). 

## Getting started

In the following sections, you will learn the main Prisma ORM workflows by setting up a TypeScript project with a SQLite database  _entirely from scratch_, creating a data model to represent the tables in your database schema, running a migration and executing some queries to write and read data in the database.

If you want to get started with your own database or see how Prisma ORM plays together with your favorite framework or library, check out the [docs](https://www.prisma.io/docs/getting-started).

### Prerequisites

To complete the next steps successfully, you need to have **Node.js (v16.13.0 or higher)** installed on your machine.

### 1. Create TypeScript project and set up Prisma ORM

As a first step, create a project directory and navigate into it:

```
mkdir hello-prisma
cd hello-prisma
```

Next, initialize a TypeScript project using npm:

```
npm init -y
npm install typescript ts-node @types/node --save-dev
```

This creates a `package.json` with an initial setup for your TypeScript app.

Now, initialize TypeScript:

```
npx tsc --init
```

Then, install the Prisma CLI as a development dependency in the project:

```
npm install prisma --save-dev
```

Finally, set up Prisma ORM with the `init` command of the Prisma CLI:

```
npx prisma init --datasource-provider sqlite
```

This creates a new `prisma` directory with your Prisma schema file and configures SQLite as your database. You're now ready to model your data and create your database with some tables.

### 2. Model your data in the Prisma schema

The Prisma schema provides an intuitive way to model data. Add the following models to your `schema.prisma` file:

```prisma
model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
  posts Post[]
}

model Post {
  id        Int     @id @default(autoincrement())
  title     String
  content   String?
  published Boolean @default(false)
  author    User    @relation(fields: [authorId], references: [id])
  authorId  Int
}
```

Models in the Prisma schema have two main purposes:

- Represent the tables in the underlying database
- Serve as foundation for the generated Prisma Client API

In the next section, you will map these models to database tables using Prisma Migrate.

### 3. Run a migration to create your database tables with Prisma Migrate

At this point, you have a Prisma schema but no database yet. Run the following command in your terminal to create the SQLite database and the `User` and `Post` tables represented by your models:

```
npx prisma migrate dev --name init
```

This command did three things:

1. It created a new SQL migration file for this migration in the `prisma/migrations` directory.
2. It executed the SQL migration file against the database.
3. It ran `prisma generate` under the hood (which installed the `@prisma/client` package and generated a tailored Prisma Client API based on your models).

Because the SQLite database file didn't exist before, the command also created it inside the `prisma` directory with the name `dev.db` as defined via the environment variable in the `.env` file.

Congratulations, you now have your database and tables ready. Let's go and learn how you can send some queries to read and write data!

### 4. Send queries to your database with Prisma Client

To send queries to the database, you will need a TypeScript file to execute your Prisma Client queries. Create a new file called `script.ts` for this purpose:

```
touch script.ts
```

Then, paste the following boilerplate into it:

```ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // ... you will write your Prisma Client queries here
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
```

This code contains a `main` function that's invoked at the end of the script. It also instantiates `PrismaClient` which represents the query interface to your database.

#### 4.1. Create a new `User` record

Let's start with a small query to create a new `User` record in the database and log the resulting object to the console. Add the following code to your `script.ts` file:

```ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.create({
    data: {
      name: 'Alice',
      email: 'alice@prisma.io',
    },
  })
  console.log(user)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

```

Instead of copying the code, you can type it out in your editor to experience the autocompletion Prisma Client provides. You can also actively invoke the autocompletion by pressing the `CTRL`+`SPACE` keys on your keyboard.

Next, execute the script with the following command:

```
npx ts-node script.ts
```

You should see the following output:

```js
{ id: 1, email: 'alice@prisma.io', name: 'Alice' }
```

Great job, you just created your first database record with Prisma Client! 🎉

In the next section, you'll learn how to read data from the database.

#### 4.2. Retrieve all `User` records

Prisma Client offers various queries to read data from your database. In this section, you'll use the `findMany` query that returns *all* the records in the database for a given model.

Delete the previous Prisma Client query and add the new `findMany` query instead:

```ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const users = await prisma.user.findMany()
  console.log(users)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

```

Execute the script again:

```
npx ts-node script.ts
```

You should see the `User` record that you created before in array brackets as an output:

```js
[{ id: 1, email: 'alice@prisma.io', name: 'Alice' }]
```

Notice how the single `User` object is now enclosed with square brackets in the console. That's because the `findMany` returned an array with a single object inside.

### 5. Next steps

In this article, you have learned how to get started with Prisma ORM in a plain TypeScript project. Feel free to explore the Prisma Client API a bit more on your own, e.g. by with relation queries using `include`, adding filtering, sorting, and pagination options in the `findMany` query or exploring more operations like `update` and `delete` queries.

#### Explore the data in Prisma Studio

Prisma ORM comes with a built-in GUI to view and edit the data in your database. You can open it using the following command:

```
npx prisma studio
```

#### Explore ready-to-run Prisma ORM examples

Check out the [`prisma-examples`](https://github.com/prisma/prisma-examples/) repository on GitHub to see how Prisma ORM can be used with your favorite library. The repo contains examples with Express, NestJS, GraphQL as well as fullstack examples with Next.js and Vue.js, and a lot more.

#### Build an app with Prisma ORM

The Prisma blog features comprehensive tutorials about Prisma ORM, check out our latest ones:

- [Build a fullstack app with Remix](https://www.prisma.io/blog/fullstack-remix-prisma-mongodb-1-7D0BfTXBmB6r) (5 parts, including videos)
- [Build a REST API with NestJS](https://www.prisma.io/blog/nestjs-prisma-rest-api-7D056s1BmOL0)

#### Go beyond Prisma ORM

Prisma is committed to creating a great developer experience for developers that are building data-driven applications, you can check out the [Data DX manifesto](https://datadx.io/) to learn more about the guiding principles for that commitment. In addition to data modeling, migrations and querying with the open-source ORM, Prisma helps with the following database workflows:

- Real-time database subscriptions using [Prisma Pulse](https://www.prisma.io/pulse)
- Connection pool and global database cache using [Prisma Accelerate](https://www.prisma.io/accelerate)

## Join the Prisma community 💚

Prisma has a huge [community](https://www.prisma.io/community) of developers. Follow [Prisma on X](https://twitter.com/prisma), join us on [Discord](https://discord.gg/KQyTW2H5ca) and ask questions via [GitHub Discussions](https://github.com/prisma/prisma/discussions).