using DynaJson;
using YamlDotNet.Serialization;

namespace Net6MarkdownWebEngine.Converter;

public class MarkdownConverter
{
    readonly IDeserializer yamlDeserializer;
    readonly ISerializer yamlToJsonSerializer;

    public MarkdownConverter()
    {
        yamlDeserializer = new DeserializerBuilder().Build();
        yamlToJsonSerializer = new SerializerBuilder().JsonCompatible().Build();
    }

    public string ConvertMarkDownTextToJson(string markdownText)
    {
        string result;

        var contents = SplitMarkdownContents(markdownText);

        // read yaml frontmatter and get serialized json string
        using (var reader = new StringReader(contents.Item1))
        {
            var yamlObject = yamlDeserializer.Deserialize(reader);

            // if there is no frontmatter, return empty, and skip creating json file
            if (yamlObject == null) return "";

            result = yamlToJsonSerializer.Serialize(yamlObject);
        }

        // parse json string by DynaJson and add body content
        var jsonObject = JsonObject.Parse(result);
        jsonObject.body = contents.Item2;
        return jsonObject.ToString().Replace("\\/","/");
    }

    private (string, string) SplitMarkdownContents(string markdownText)
    {
        var contents = markdownText.Split("---");
        var frontmatter = contents[1];

        string? body;
        if (contents.Length == 3)
        {
            body = contents[2];
        }
        else
        {
            var requiredContents = contents.Skip(2).ToArray();
            body = string.Join("---", requiredContents).Trim();
        }

        var result = (frontmatter, body);
        return result;
    }
}

