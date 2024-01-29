*This is the twelfth issue of The Starlet List. If you want to prompt your open source project on star-history.com for free, please check out our [announcement](/blog/list-your-open-source-project).*

---


![waspsh_logo](/blog/assets/wasp/waspsh_logo.webp)

[Wasp](https://wasp-lang.dev/) is a fully open-source, full-stack web framework for React, Node.js, and Prisma. Use it to develop and deploy any web application backed by a database with all the common features ready out-of-the-box, without any 3rd party services - authentication, cron jobs, sending emails, …

Wasp is currently in Beta and has been used to create over 25,000 projects. It also has its own [GPT-powered SaaS starter](https://usemage.ai/) that you can use for free to create a full-stack app codebase from a short description.

## How it works?

![wasp_code_example](/blog/assets/wasp/wasp_code_example.webp)

Wasp is based on a simple configuration language backed by a custom-made compiler. This lets Wasp understand your web app's complete structure and requirements, from front-end to database and even deployment, resulting in faster development and much less boilerplate code.

![wasp_compilation_diagram](/blog/assets/wasp/wasp_compilation_diagram.webp)

The best part is that you still write most of your code in the stack you already know, React & Node.js, and have complete flexibility to use your favorite npm libraries. Wasp is just a tool to help you move faster, with best practices included.

## What you get

- **Full-stack authentication** - username/email & password or social auth (google, github). No 3rd party services
- **Full-stack type-safety** - full TypeScript support with auto-generated types across the whole stack
- **Typesafe RPC** **- no API**; your data models and server logic are instantly brought to the client
- **One-line deployment** - deploy to any platform; Wasp CLI offers powerful helpers
- **Async jobs** - easily define, schedule, and run specialized server tasks
- **Email sending** - just connect an email provider or use SMTP
- **Powerful CLI** - Wasp CLI covers everything from running your app, database migrations to deployment
- **And more!** - Custom API routes, database seeding, automatic cache invalidation, …

![auth_demo_customize](/blog/assets/wasp/auth_demo_customize.webp)

## Made with Wasp

- [https://coverlettergpt.xyz/](https://coverlettergpt.xyz/) - Generate a cover letter via GPT based on your resume - used for 10,000 resumes!
- [https://www.amicus.work/](https://www.amicus.work/) - A project management software for legal teams
- [https://description-generator.online/](https://description-generator.online/) - Generate a product listing based on a description or image for your Etsy marketplace via GPT. [[Acquired - read more!](https://dev.to/wasp/from-idea-to-exit-building-and-selling-an-ai-powered-saas-in-5-months-27d9)]
- See more examples [here](https://wasp-lang.dev/#examples)

## Getting started

1. Install Wasp:

    ```bash
    curl -sSL https://get.wasp-lang.dev/installer.sh | sh
    ```

2. Create a new project with a SaaS template: 

   ```bash
   wasp new <my-new-project> -t saas
   ```

3. Run it!

   ```bash
   wasp start
   ```

For more details, check out the docs: [https://wasp-lang.dev/docs/quick-start](https://wasp-lang.dev/docs/quick-start)

## Learn more about Wasp

Wasp has had a pretty solid Year 2023, and in October alone we doubled our stars, growing from 4k to 8k🚀.

[![Star History Chart](https://api.star-history.com/svg?repos=wasp-lang/wasp&type=Date)](https://star-history.com/#wasp-lang/wasp&Date)

If you'd like to learn more and try out Wasp for yourself, visit our site!

- Website: [http://wasp.sh/](http://wasp.sh/)
- GitHub: [https://github.com/wasp-lang/wasp](https://github.com/wasp-lang/wasp)
- Discord: [https://discord.gg/rzdnErX](https://discord.gg/rzdnErX)