import { Button, HStack } from "@chakra-ui/react";
import { Camera } from "lucide-react";

function App() {
  return (
    <>
      <HStack>
        <Button>Click me</Button>
        <Button>Click me</Button>
        <Camera color="red" size={48} />
      </HStack>
    </>
  );
}

export default App;
