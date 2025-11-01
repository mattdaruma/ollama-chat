# VSCode Gemini Code Assist is currently bugged and unable to run shell commands.  

Never attempt to run a shell command on your own, but also freely include them in your strategy as seems appropriate.  Print it for the user to run and wait for him to provide feedback on what happened before proceeding.


# Take it slow.

Just take one action at a time and wait on the user's feedback on the results.  If it is necessary to modify multiple files simultaneously to keep the dev server running and see a difference in testing, that is acceptable.  Be sure to start by mentioning which files you're about to update.  We don't have to stick to one file, but we do stick to one concept at a time.  You might end a task with a suggestion about what might be a good next step, but let the user prompt you to advance on any of the work included in this file or your own ideas.


# Avoid Redundancy

Before installing or creating anything new, be sure to check package.json and/or (as appropriate for the task) ~/ollama-chat/src/* files to verify that we do not already have something that would work to accomplish the goal.  We want to try to keep the app light without avoiding any useful features or UX bonuses.


# You are attempting to build a locally run ollama chat app.

## Use Icons

On any button and in most header text, there is probably an icon that is appropriate for the context.  Be liberal with icons.  They help the user quickly visually digest the screen without needing to read.  If the bootstrap icons are insufficient, we can install a bigger package.  There may be an exception or two, but generally every button requires an icon.  Some buttons may ONLY have an icon and no text.

## Cacheable

Almost every input field should be cached to localStorage and read from there on next commit.  Be very liberal (but secure) with localStorage caching.  Everywhere we add a cache, we should also include a small icon button with hover text to clear the cache.  It is ideal to include a timestamp of when the cache was written, but that may not look clean where space is tight.  Use good judgement to create a clean but informative UI/UX.  

## Configurable

There should be a settings component where the user can adjust features in the app that apply to multiple components.  Specifically what belongs here will be sorted out during development as useful features become apparent. 

### Theming

In the settings component, the user should be able to control the app's theme.  For color selection, it may be necessary to install an extra package.  It would be nice to provide a small button that shows the color which, when clicked, provides the user with a feature rich color wheel to select an RGBA color.  

We will provide them with options for: 
- Primary App Color: the color of the app bar and impactful buttons
- Secondary App Color: the color of less impactful buttons
- Danger App Color: the color of error messages and risky buttons (every delete button should use the danger color and have a confirmation dialog by default)
- Primary Background Color: the color of the page's background, like the body element
- Secondary Background Color: the color of internal divs, usually just a lighter or darker shade of the primary color
- Primary Text Color: the color of header text
- Secondary Text Color: the color of body text
- Helper Text Color: a muted color for things like timestamps or field hints
- Primary Text Font: the font family of header text
- Secondary Text Font: the font family of body text
- Helper Text Font: a muted font for things like timestamps or field hints

And I don't actually have a use in mind for any of these yet, but maybe in the future.  DO NOT START WORKIGN ON THEM WITHOUT EXPLICIT PROMPTING TO DO SO:
- Link Color: the color of links to external pages
- Depth: the depth of box shadows or gradients for 3d effects.  0 means flat.  You can pick an appropriate maximum.  2?  3?  5?  If there's an obvious answer or I'm way off, go with your own opinion.  These are just spitball ideas in case it's too odd of a concept and there is no obvious answer.  It may be best to just make it a toggle, 0 or 1, but I like the notion of letting them make it pop more or less.
- Gradients: color gradients for different elements.  When toggled on, everything in the above set with "[Priority] [Purpose] Color" in the name would also have a "[Priority] Gradient Color".  It would begin with a dropdown selector, choosing an option in which would provide additional appropriate fields.  (No Gradient is the null/default option.): 
    - Linear Gradient: use a linear-gradient(... style
        - Angle: the angle parameter (we will only use this and not the keywords/directions)
        - Color Start: a color picker and a color-stop % (take as number between 0 and 1, presented as percentage)
        - Color Stop: a color picker and a color-stop % (take as a number between 0 and 1, presented as a percentage)
        - Repeating: a toggle or checkbox that uses the repeating-linear-gradient(... style instead
    - Radial Gradient
        - Shape: circle or ellipse
        - Size: Defines how big the gradient's ending shape is (e.g., closest-side, farthest-corner).  I'm not sure what kind of options to provide here, but it seems like a limited set that belongs in a dropdown.  I do not want to require the user to know it and type it out, though an autocomplete may be okay as long as it provides suggestions immediately on being clicked like a dropdown
        - Position: X and Y % inputs for the center of the gradient
        - Color Start: a color picker and a color-stop % (take as number between 0 and 1, presented as percentage)
        - Color Stop: a color picker and a color-stop % (take as number between 0 and 1, presented as percentage)
        - Repeating: a toggle or checkbox that uses the repeating-radial-gradient(... style instead
    - Conic Gradient
        - Angle: defines the starting rotation in degrees
        - Position: X and Y % inputs for the center of the gradient
        - Color Start: a color picker and a color-stop % (take as number between 0 and 1, presented as percentage)
        - Color Stop: a color picker and a color-stop % (take as number between 0 and 1, presented as percentage)
        - Repeating: a toggle or checkbox that uses the repeating-conic-gradient(... style instead

Direction/Shape: For Linear, an angle or direction (e.g., top-left to bottom-right). For Radial, the center position and perhaps the size. For Conic, the start angle.
- Animated: a toggle switch on whether to include animations or just chop straight to new behavior.  

Initialize all of their values to that which would match the default bootstrap theme.  Pipe their values throughout the app to their matching elements

## The Chat Component

### Deletable Message History

The chat history should be deleteable by individual messages, by the entire log, all above a given message, and all below a given message.

### Multi Cache

The chat history should be able to be saved at any point in time with a name and a timestamp.  It should be possible to save multiple chat logs and reload any of them with a click.  It should also be possible to delete any specific cached log or all cached logs at once.  


# Gemini Notex

This is where you can add hints to your future self, Gemini!