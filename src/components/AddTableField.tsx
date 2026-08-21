import { Link, Text } from "@cloudflare/kumo";

export const AddTableField = (props: {
  name: string;
  value: string;
  link?: string;
}) => {
  return (
    <div className="flex flex-col gap-1 py-1">
      <Text variant="secondary" size="sm" as="span">
        {props.name}
      </Text>
      {props.link ? (
        <Link href={props.link}>{props.value}</Link>
      ) : (
        <Text as="span">{props.value}</Text>
      )}
    </div>
  );
};

export default AddTableField;
