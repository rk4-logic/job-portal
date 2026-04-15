import { Grid, Card, Flex, Box, Text, Heading } from "@radix-ui/themes";
import { Briefcase, Users } from "lucide-react";

const StatsCard = () => {
  return (
    <Grid columns={{ initial: "1", sm: "2", lg: "3" }} gap="6" width="100%">
      
      {/* Open Jobs Card */}
      <Card variant="surface" style={{ backgroundColor: "var(--blue-2)", borderColor: "var(--blue-4)" }}>
        <Box p="5">
          <Flex align="center" justify="between">
            <Box>
              <Heading as="h3" size="7" weight="bold">
                589
              </Heading>
              <Text size="2" color="gray">
                Open Jobs
              </Text>
            </Box>
            <Flex 
              align="center" 
              justify="center" 
              p="3" 
              style={{ backgroundColor: "var(--blue-4)", borderRadius: "var(--radius-3)" }}
            >
              <Briefcase size={24} color="var(--blue-9)" />
            </Flex>
          </Flex>
        </Box>
      </Card>

      {/* Saved Candidates Card */}
      <Card variant="surface" style={{ backgroundColor: "var(--orange-2)", borderColor: "var(--orange-4)" }}>
        <Box p="5">
          <Flex align="center" justify="between">
            <Box>
              <Heading as="h3" size="7" weight="bold">
                2,517
              </Heading>
              <Text size="2" color="gray">
                Saved Candidates
              </Text>
            </Box>
            <Flex 
              align="center" 
              justify="center" 
              p="3" 
              style={{ backgroundColor: "var(--orange-4)", borderRadius: "var(--radius-3)" }}
            >
              <Users size={24} color="var(--orange-9)" />
            </Flex>
          </Flex>
        </Box>
      </Card>

    </Grid>
  );
};

export default StatsCard;