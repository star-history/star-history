Hey all, welcome to the August edition of Star History Monthly! This time we are taking a look at a few open-source CLI tools for working with ChatGPT and other LLMs.

The inspiration for this topic actually came from [this Tweet](https://twitter.com/hellokillian/status/1699540666953629722).

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">hottest app of 2023 will be Terminal<br><br>did you know you could drag files into it? you can open folders with it?? <br><br>so incredibly well integrated in the OS, like the most native app of all time <a href="https://t.co/q4DKKsdqCt">pic.twitter.com/q4DKKsdqCt</a></p>&mdash; killian (@hellokillian) <a href="https://twitter.com/hellokillian/status/1699540666953629722">September 6, 2023</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

CLI tools are great, they can replace just about any GUI out there. For a novice user, a Terminal might take some time getting used to, but if you are experienced, you can configure your Terminal to an aesthetic dashboard and accomplish more advanced tasks.

## Open Interpreter

[Open Interpreter](https://github.com/KillianLucas/open-interpreter/) lets LLMs run code on your computer to complete tasks. Open Interpreter combines the power of OpenAI GPT-4's Code Interpreter with the flexibility of your local environment and has full access to the Internet.
Tell it to set your computer to dark mode, edit videos, search for something on the Internet, or even set up a virtual environment - all via your Terminal🤯. This takes things one step further: no need to ask your AI assistant to write code via a GUI, and then execute it somewhere else.

![open-interpreter](/assets/blog/cli-tool-for-llm/open-interpreter.webp)

And yes, Open Interpreter's author wrote the Tweet above. Hard to imagine why.

## llm

[llm](https://github.com/simonw/llm) is a command line for running prompts against LLMs, getting the results back on the command-line and also storing the prompt and response in a SQLite database. Currently, OpenAI models are supported by default, but you can install plugins to make other LLMs available.

To get it working, you need to install the tool, put your OpenAI API key somewhere it can find, and voila, start playing with it. Try asking it to translate your release notes to French, and the outputs will be directly prompted to your Terminal.

![llm](/assets/blog/cli-tool-for-llm/llm.webp)

## GPT Pilot

AI can now write most of the code for an app, but it won’t work unless all the code works cohesively. [GPT Pilot](https://github.com/Pythagora-io/gpt-pilot) is a fascinating devtool that can code an entire, production-ready app.

![gpt-pilot](/assets/blog/cli-tool-for-llm/gpt-pilot.webp)

It works by describing an app you want to build and GPT Pilot works with an LLM to clarify specific app requirements, before finally writing the code.

Right now, GPT Pilot is still in the early stages and can only build simple web apps like a real-time chat app or a timer app, but this concept obviously has far-reaching significance for the future.

## aider

[aider](https://github.com/paul-gauthier/aider), as the name suggests, is AI pair programming in your Terminal. Once you launch aider from the command line with your source files, you can discuss and edit together. Aider supports all OpenAI's chat models (and GPT-4 is the recommended model to use for code editing).

![aider](/assets/blog/cli-tool-for-llm/aider.webp)

When you put it side to side with GPT Pilot, aider acts more like guidance for writing an app, while GPT Pilot is more like a contractor where they collect the requirements and present you with the final results.

## Butterfish 🐠

[Butterfish](https://github.com/bakks/butterfish) equips your shell with AI superpowers. It is basically a transparent shell wrapper with GPT and currently works on MacOS and Linux. One of the reasons why ChatGPT is useful is that you can have a conversation with it, and have it tweak and improve its answers. Butterfish has memory as well, and it can include previous context by injecting your shell history into the chat.

![butterfish](/assets/blog/cli-tool-for-llm/butterfish.webp)

Another cool thing is that you can start a prompt simply with a capital letter. For example, `$ Write me a poem` will be sent as a ChatGPT prompt and expect your Terminal to return a poem.

## Lastly

[![Star History Chart](https://api.star-history.com/svg?repos=KillianLucas/open-interpreter,simonw/llm,Pythagora-io/gpt-pilot,paul-gauthier/aider,bakks/butterfish&type=Date)](https://star-history.com/#KillianLucas/open-interpreter&simonw/llm&Pythagora-io/gpt-pilot&paul-gauthier/aider&bakks/butterfish&Date)

All these aforementioned tools emerged somewhere this year - and have all undoubtedly gained momentum thanks to the rapid growth of LLMs. These have taken a "mere GUI for LLM" to the next level, accomplishing all sorts of tasks from tweaking a computer setting to building simple apps. Are developers going to be out of jobs? Is coding soon no longer required? Obviously, these tools can change the game for the software industry, but you still need to be good at coding: an unskilled person powered by such a tool can slowly construct a codebase that's unmaintainable.

Of course, there are many more tools we didn't mention here that let you work with LLMs of your choice easily from your Terminal, such as [llama.cpp and Ollama](/blog/llama2).
