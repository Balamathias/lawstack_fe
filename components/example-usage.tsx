import { CodeBlock } from "./ui/code-block";

export function ExampleUsage() {
  return (
    <div className="space-y-6">
      <h2>Example Code</h2>
      
      <CodeBlock 
        language="javascript"
        code={`function hello() {\n  console.log("Hello world!");\n}\n\nhello();`}
      />
      
      <CodeBlock 
        language="python"
        code={`def hello():\n    print("Hello world!")\n\nhello()`}
      />
    </div>
  );
}
