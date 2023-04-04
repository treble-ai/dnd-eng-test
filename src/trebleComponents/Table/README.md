# Documentation


# Properties
| Name            | Type                          | Description  |
| --------------- |:-----------------------------:| ------------:|
| header        | `list[str]`                     | The display headers of the table|
| atributes     | `list[str]`                     | The keys of every row  |
| data          | `list[dict]`                    | Elements to fill the table |
| displayCell   | `function(dict, str)->str`      |Functions that tells how to display information on the table |