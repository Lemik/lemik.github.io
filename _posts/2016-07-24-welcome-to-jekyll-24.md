---
layout: post
title:  "Welcome to Jekyll! LEO 24"
date:   2016-07-24 12:52:53 -0700
categories: jekyll update
---

I hate markup languages. There, I said it. The first time I had the pleasure of "using" (being abused by) XML, I said to myself "there has got to be a better way of doing this." Well, after years of sticking with plain text ini files and custom syntaxes based off of using ''eval()'', I've come to not only use, but love, YAML.

YAML, or "YAML Ain't Markup Language", is "a human friendly data serialization standard for all programming languages." It has the advantage of leaning towards dynamic languages a la Python, Ruby, etc.

It is important to note that friendliness and readability are very core to the design of YAML. The number of format characters is very low and, like Python, YAML's markup can use whitespace to indicate scoping of items. Tabs are not allowed, so there is no chance for confusion about indention level. Additionally, the constructs within YAML such as mappings, sequences, and scalars all mesh nicely with existing Python data types like dictionaries, lists, strings, and integers. It's also fully unicode-enabled, which should make happy a lot of people who are normally worried about UTF-8.

What really attracted me to YAML are some of the key things that drew me to Python: cleanliness and approachability. Too often, I've had to deal with monstrous XML files for data passing or -- worse yet -- configuration and sometimes ini-style configuration files that simply don't scale, or communicate enough information. So far, I've used YAML in about six different projects with great success and found that it scales quite well while staying human-readable.

SYNTAX IS KEY
YAML, on its face, is amazingly simple. Take the code below, for example. Run through the pyyaml load function (more on PyYAML in a moment):

 # YAML
name: Jesse
This YAML will get the following Python dictionary:

>>> import yaml
>>> yaml.load("""
...  # YAML
... name: Jesse
... """)
{'name': 'Jesse'}
>>>
This is a simple example. Line 1 of the YAML file, or document, is a simple comment. Note that there is a space character right before that # sign. The next line is a simple key value pair which, after being parsed, gets returned to us in a Python dictionary. Simple as pie!

A simple name-value pair is easy to do. Here is a document with some additional structures and details to try:

 # YAML
object:
    attributes:
        - attr1
        - attr2
        - attr3
    methods: [ getter, setter ]
Here, we have defined a top-level entity named "object". This object has two block mappings related to it, ''attributes'' and ''methods''. The ''attributes'' mapping uses the more verbose YAML syntax for a list, in this case:

attributes:
    - attr1
    - attr2
    - attr3
In this case the YAML represents a key with a name of ''attributes'' while each item underneath it, prefaced with a "''-''", represents an item that will appear in a list as a value for that key. Here it is printed after a load:

{'object': {'attributes': ['attr1', 'attr2', 'attr3'], ...
The ''methods'' key uses YAML shorthand to accomplish the same thing. In my experience, non-programmers tend to understand the first method, "''-''" prefacing, a bit more than the second method. Both parse to Python lists:

{'object': {'attributes': ['attr1', 'attr2',
                           'attr3'],
            'methods': ['getter', 'setter']}}
I included both examples to illustrate a point. Most of YAML's syntax has two ways of achieving the same intended goal. There is the verbose, multi-line method, and the more compact method. Both methods are human-readable, so choosing one is a matter of personal preference.

As you can see, the most basic syntax is as follows:

dicts/hashes: key, value separated by a colon and space, e.g. ''key: value''; additionally, you can use ''{key: value}''

lists: dash followed by a space then the item, e.g. ''- item''; additionally, you can use ''[item, item, item]''

Strings do not require quotation. You can preserve line breaks with the ''|'' character; for example:

 # YAML
sonnet: |
    I wish I could
    write a poem
    but I can't
This would parse to:

{'sonnet': "I wish I could\nwrite a poem\nbut I can't\n"}
Trailing and preceding whitespace is trimmed out in the basic use case of ''|''. See the "Scalar indicators" section of the compact cheat sheet for modifiers to the ''|'' character.

Core to YAML is the concept of documents. A document is not just a separate file in this case. Instead, think of a document as just a chunk of YAML. You can have multiple documents in a single stream of YAML, if each one is separated by ''---'', like:

 # YAML
---
document: this is doc 1
---
document: this is doc 2
...
Using an ellipsis explicitly ends a document. The nice thing about documents is you can treat them as different entities. Let's say, "people" and "cars" are in the same file. You can use them for a bunch of entities that look alike, e.g.:

name: SomeObject
attributes:
    - attr1
    - attr2
    - attr3
methods: [ getter, setter ]
---
name: MyPrettyObject
attributes:
    - attr1
    - attr2
    - attr3
methods: [ getter, setter ]
which parses to:

{'attributes': ['attr1', 'attr2', 'attr3'],
 'methods': ['getter', 'setter'],
 'name': 'SomeObject'}
{'attributes': ['attr1', 'attr2', 'attr3'],
 'methods': ['getter', 'setter'],
 'name': 'MyPrettyObject'}
YAML also supports variables, or repeated nodes, which at first didn't click for me. The simplest explanation is that you define something as a variable by preceding it with ''&NAME value'' and you can refer to it with ''*NAME'' e.g.:

 # YAML
some_thing: &NAME foobar
other_thing: *NAME
Parses to:

{'other_thing': 'foobar', 'some_thing': 'foobar'}
As you can see, the syntax is pretty simple. It's easy to represent information in a way that is both clear, concise and, well... fun. What's really cool is the fact it meshes so well with Python!

Note that fans of JSON (JavaScript Object Notation) will quickly realize that the concise-version of the syntax (e.g. using ''[value, value]'') looks a lot like JSON. In fact, for the most part, JSON is a subset of YAML syntax. With a little bit of additional pre-processing you should be able to pass your JSON off as YAML and vice-versa.

AND WITH THAT, PYYAML
After reading the basic of the syntax, you're jazzed to get started with YAML, right? Well, getting started with YAML is only a single ''easy_install'' away. The **PyYAML** module is pretty much the de-facto parser and emitter for YAML. The core of the module is written in pure Python, but, as of version 3.0.4, it also supports binding to the high-speed LibYAML implementation written in C.

PyYAML is blindingly simple to use for most cases. To generate all of the output I've used in the article so far, all I used was:

import yaml
import pprint
for project in yaml.load_all(open('test.yaml')):
    pprint.pprint(project)
The ''load_all()'' function goes back to the "multiple documents within a stream" concept. In the case above I am assuming that there won't be just a single document. I am using ''yaml.load_all()'', rather than ''load()'', then iterating over the results. ''yaml.load_all()'' returns a generator yielding each document in the stream. The ''yaml.load()'' function accepts a string (Unicode or otherwise), or an open file object.

For many cases, you'll be loading a single document. You might use it for configuration loading:

configuration = yaml.load(open('test.yaml').read())
Of course, one of the other aspects to PyYAML is dumping Python data structures to a YAML file. Take, for example, Listing 1:

#!/usr/bin/python

import yaml

mydata = {'person' : 'jesse',
          'hobby' : 'python',
          'employed' : True,
          'limbs': {'arms' : 2, 'legs' : 2},
          'family' : ['wife', 'toddler']}

print yaml.dump(mydata)
In this case, I am constructing a dictionary containing all of the data I want to include in the YAML file. Then I simply call ''yaml.dump()'' and the output of Listing 1 looks like well-formed YAML:

$ python Listing1.py
employed: true
family: [wife, toddler]
hobby: python
limbs: {arms: 2, legs: 2}
person: jesse
Additionally, PyYAML includes ''yaml.dump_all()''. It accepts a list of objects to serialize and writes to the target stream. Let's make Listing 1 handle a series of objects:

mydata = [ mydata for i in range(2) ]
print yaml.dump_all(mydata, explicit_start=True)
And our output is fairly obvious:

---
employed: true
family: [wife, toddler]
hobby: python
limbs: {arms: 2, legs: 2}
person: jesse
---
employed: true
family: [wife, toddler]
hobby: python
limbs: {arms: 2, legs: 2}
person: jesse
By default, you don't need to pass additional arguments to ''yaml.dump()'' or ''yaml.dump_all()'', as you can see above. In the ''dump_all()'' example, I added the ''explicit_start'' argument. The dump functions support this flag, along with some others that you should know about, to control formatting.

The ''explicit_start'' argument adds the "---" string prior to the data structure being dumped. This allows you to dump multiple objects/documents to the same stream, say, an open file handle, without worrying about the document separators yourself.

Adding the ''default_flow_style'' argument changes the output from the default compact style of output, to the more verbose, "humane" output:

print yaml.dump(mydata, default_flow_style=False)
And the output:

employed: true
family:
- wife
- toddler
hobby: python
limbs:
  arms: 2
  legs: 2
person: jesse
You can also control indenting, width, and so on. You can also switch it to canonical mode, which explicitly defines the type of the value within the YAML:

print yaml.dump(mydata, canonical=True)
And the matching output:

!!map {
  ? !!str "employed"
  : !!bool "true",
  ? !!str "family"
  : !!seq [
    !!str "wife",
    !!str "toddler",
  ],
  ? !!str "hobby"
  : !!str "python",
  ? !!str "limbs"
  : !!map {
    ? !!str "arms"
    : !!int "2",
    ? !!str "legs"
    : !!int "2",
  },
  ? !!str "person"
  : !!str "jesse",
}
Yes, I just jumped the tracks on that last one. YAML and PyYAML both support explicit type declaration within the YAML documents. This is obviously handy for inter-language data exchange, but, as you can see in the output, is not so good on the side of readability if you're a non-programmer. On the other hand, it allows for a nice segue!

=h=Turning the Awesome Up=h=

We have covered the basics of YAML and, by extension, PyYAML, but PyYAML offers some additional niceties for Python users. Obviously, these advanced features start to edge out approachability, but they are actually really useful.

In the last example of the last section, we turned on the ''canonical'' flag to the ''dump'' function, which caused it to spit out explicitly typed YAML. Each type was in the format of

''!!''
. These are standard YAML tags, and they're fully covered in the spec.

Internally, PyYAML converts these tags to the expected Python types. ''!!null'' is ''None'', ''!!timestamp'' is ''datetime.datetime'', ''!!seq'' is ''list'', and so on. You don't need to explicitly put these in your YAML documents. In most cases the types are inferred from the document, but being able to explicitly define them is handy.

PyYAML can take the ''!!'' syntax a bit further though, and adds a series of Python-specific tags which are exceedingly useful. Each one of the Python-specific tags is prefaced with

''!!python/''
. PyYAML defines explicit Python types such as ''float'', ''complex'', ''list'', ''tuple'' and ''dict''. In my opinion, the ''tuple'' and the ''integer'' ones are more useful simply due to the fact that ''dicts'' and ''lists'' can be derived from the YAML file itself.

However, PyYAML also offers "non-type" ''!!python'' extensions. These are referred to as "Complex Python Tags" and they allow you to add things to your YAML document such as Python modules, packages, class instances, and the output of a method call with a passed-in variable.

Say we wanted to have a YAML file which defined some number of variables, but then passed one or more of them to a given module's method. I wanted something to list the contents of my home directory on parsing:

 # YAML
directory: &DIRECTORY /Users/jesse
contents: !!python/object/apply:os.listdir [*DIRECTORY]
And the abbreviated output:

{'contents': ['.bash_history',
              '.bash_profile',
              'todo.txt'],
 'directory': '/Users/jesse'}
Virtually any function can be called this way. You can also pass in keyword arguments and other data as required. Calling a function, though, is rather easy. Here's an example YAML file which uses the PyYAML ''new:module.class'' tag to create a ''Queue.Queue'' at load-time with a defined max size:

qsize: &SIZE 10
queue: !!python/object/new:Queue.Queue {maxsize: *SIZE}
Which, of course, passes you back the correct class instance:

{'qsize': 10, 'queue': }
In theory, and in my rather abusive practice, this would allow you to define a very rich configuration which constructed all of the relevant objects at parse-time to significantly alter the behavior of the application (or in my case, test) to which the YAML file was passed. One catch when you are using the ''!!python/object/*'' tag(s) is that the objects you are creating must be pickle-compatible.

For example, if you tried this:

 # YAML
threadpool:
 - !!python/object/new:threading.Thread
  target: myapp.myfunction
It would fail with an assertion error:

AssertionError: Thread.__init__() was not called
PyYAML is not calling ''__init__()'' when creating the object. Both ''yaml.load()'' and ''yaml.dump()'' are designed to work exactly like ''pickle.load()'' and ''pickle.dump()''. Objects must implement the pickle protocol.

CONCLUSION
YAML and, by extension, PyYAML, are incredibly useful if you want something easy on the eyes, easy to understand, and easy to use in a markup language. It's straightforward to customize, it's cross-language, and fundamentally simple. YAML is popping up in all sorts of places, such as the configuration settings for Google's AppEngine, and in Django, where it is used for a serialization format and to load data fixtures.

Obviously some of the advanced features of PyYAML are Python-specific, but the fundamentals make it an easy win for cross-language communication. Sure, XML does this, too, and there's support in every known language for XML parsing (including the stuff toddlers speak), but how readable is XML, seriously?

I do hope more and more people adopt this user-friendly format. It's simply great as a configuration language, and if you need to expose anything to humans and later serialize and deserialize it, just say "no" to XML.

The revolution will be readable.

Requirements: