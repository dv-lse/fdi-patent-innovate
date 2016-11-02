# Requirements

- [ ] Github should display markup reasonably
- [ ] Support for inline and standalone links (? maybe not)


- [ ] Highlight current section?  (in which case, viz tied to h2/h3 & never inline)

- [ ] Should be possible to bookmark at anchor *best supported via markdown heading anchors*

- [ ] Make the h1 into the page title/banner across the top

- [ ] Easy to determine which link is active


what if we pull visualisation links out to the side of the text


*JSON is nice, but would it be better to have a URL-like
format?*

[See this](https://bost.ocks.org/mike/scroll/) for usability guidance.
[And this](http://vallandingham.me/scroller.html) for concrete code.


Options for scroll + viz in markdown:

- break entire document into slides based on a particular heading (e.g. ###)
  ... leading info will need to be included with a slide (higher level headings)

- rule:  (a) put visualisation at logical place (directly underneath the relevant header)

-   ()
\

DECISION:  put the visualisation marker where it's most logical: under the relevant heading

- algorithm is:  find the visualisations, then the prior heading.  then split on that heading into sections,
  leaving any higher-level heading in the NEXT section and any leading material in the FIRST section.

  done!!
