# RegMaker 🎯
A custom dynamic Regex creation and customization util for applications.
If you've ever found yourself wrestling with creating new regex patterns during runtime, this might be exactly what you need.


## Why would I need this?
- If you need to generate regex values that needs to change in runtime and you dont want to write repeated code or relearn regex again for the 100th time.

- You have specific text that changes and you want an easy way to capture specific data in a predictable manner out of the box.(Fetch Tailwind values from the text)

- You require user input regex generation, allowing the user to fetch their own data from a text via regex.

- Perhaps you need to make complex search filters, input validators or any text parsers where regex is applied

And More!


## 🚀 What's Inside:
- 📝 Build regex patterns by just showing examples (way easier than writing them by hand!)
- 🔄 Mix and match patterns together
- ⚡ Comes with all the common patterns you'll need
- 🎨 Add your own custom patterns when you need something special
- 🛡️ Written in TypeScript because we all like catching errors early
- 💪 Handles errors gracefully so your app won't break

## 📦 Getting Started

Pop this into your terminal:

```bash
npm install regmaker
# or if you're using yarn
yarn add regmaker
```

## 🎮 Let's See It In Action

Here's a quick example to get you started:
Give it an string example, tell it what you want found from the example or some queries, and have it ready for you!

```typescript
import { RegMake } from 'regmaker';

// Create your regex maker
const regexMaker = RegMake();

// Let's make a pattern - way easier than writing regex by hand!
let value_attr = { any_number: ["2"] };
const firstExample = "p-[2rem]";
regexMaker.create_exp(firstExample, value_attr, true, ['g']);

// Try it out
const input = "p-[4rem]";
console.log(regexMaker.matchAll(input, true));
// You'll get: ['4']
```

## 📚 What's Inside

### Built-in Patterns You Can Use

I've included a bunch of patterns you'll probably need:

- `any_number`: Grabs any number (`\d+`)
- `any_char`: Matches whatever character (`.*?`)
- `any_word`: Catches any word (`\w+`)
- `lowercase_word`: Just lowercase stuff (`[a-z]+`)
- `uppercase_word`: UPPERCASE ONLY (`[A-Z]+`)
- `first_word`: Words that start with letters (`[A-Za-z]+`)
- `alphanumeric`: Letters and numbers (`[a-zA-Z0-9]+`)
- `non_alphanumeric`: Everything else (`[^a-zA-Z0-9]+`)
- `neg_positive_number`: Numbers with plus or minus (`[+-]?\d+(\.\d+)?`)
- `hex`: For those hex colors (`[A-Fa-f0-9]+`)
- `ascii`: Good old ASCII (`[\x20-\x7E]+`)

### Cool Stuff You Can Do

#### Combining Patterns

Here's something neat - you can merge patterns together:

```typescript

// Start with one pattern
value_attr = { any_number: ["2"] };
regexMaker.create_exp("p-[2rem]", value_attr, true, ['g']);

// Add another
value_attr = { any_number: ["90"] };
regexMaker.merge_exp("w-[90%]", value_attr, true);

// And another!
value_attr = { any_number: ["500"] };
regexMaker.merge_exp("bg-indigo-500", value_attr, true, ['g']);

// Now try them all together
const input = "p-[4rem] w-[40%] bg-indigo-500";
console.log(regexMaker.matchAll(input, true));
// Check it out: ['4', '40', '500']
```

#### Make Your Own Patterns

Need something specific? No problem, Create your own expression you want to capture:

(Note: The value in the newType param will overwrite the value_attr param's value if they are identical...)

```typescript

// Add your own pattern
regexMaker.add_custom("custom_pattern", "\\w{10}");

// Use it
value_attr = {};
regexMaker.create_exp("(1232151913)", value_attr, true, ['g'], {
    "custom_pattern": "1232151913"
});
```

### The Main Functions

- `RegMake()`: Gets you started with a new instance
- `create_exp()`: Creates a pattern from your example
- `merge_exp()`: Combines patterns together
- `matchAll()`: Finds all matches in your text
- `add_custom()`: Adds your own patterns
- `replace()`: Swaps out text using your patterns

## 🤝 Want to Help?

Got ideas? Found a bug? Want to add something cool? I'd love your help! Just open an issue or send a pull request.

## ⭐ Show Some Love

If this helps you out, a star would make my day! And if you run into any issues or have ideas, just open an issue.



P.S. Check out the examples folder for more cool stuff you can do with this!
