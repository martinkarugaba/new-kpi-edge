import { type ParticipantFormValues } from '../participant-form';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface DataPreviewProps {
  data: ParticipantFormValues[];
  projects: { id: string; name: string }[];
  selectedProject: string;
  selectedDistrict: string;
  selectedSubCounty: string;
  onProjectSelect: (value: string) => void;
  onDistrictSelect: (value: string) => void;
  onSubCountySelect: (value: string) => void;
  districts: string[];
  subCounties: string[];
}

export function DataPreview({
  data,
  projects = [], // Add default empty array
  selectedProject,
  selectedDistrict,
  selectedSubCounty,
  onProjectSelect,
  onDistrictSelect,
  onSubCountySelect,
  districts = [], // Add default empty array for consistency
  subCounties = [], // Add default empty array for consistency
}: DataPreviewProps) {
  return (
    <Card className="w-full">
      <CardHeader className="">
        <CardTitle>Preview</CardTitle>
        <CardDescription>
          Showing first 5 of {data.length} participants
        </CardDescription>

        <div className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="project">Select Project for All Participants</Label>
            <Select value={selectedProject} onValueChange={onProjectSelect}>
              <SelectTrigger id="project" className="w-full">
                <SelectValue placeholder="Select a project" />
              </SelectTrigger>
              <SelectContent>
                {Array.isArray(projects) &&
                  projects.map(project => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="district">
              Select District for All Participants
            </Label>
            <Select value={selectedDistrict} onValueChange={onDistrictSelect}>
              <SelectTrigger id="district" className="w-full">
                <SelectValue placeholder="Select a district" />
              </SelectTrigger>
              <SelectContent>
                {districts.map(district => (
                  <SelectItem key={district} value={district}>
                    {district}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subCounty">
              Select Sub-County for All Participants
            </Label>
            <Select
              value={selectedSubCounty}
              onValueChange={onSubCountySelect}
              disabled={!selectedDistrict}
            >
              <SelectTrigger id="subCounty" className="w-full">
                <SelectValue placeholder="Select a sub-county" />
              </SelectTrigger>
              <SelectContent>
                {subCounties.map(subCounty => (
                  <SelectItem key={subCounty} value={subCounty}>
                    {subCounty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="rounded-md">
        <div className="rounded-md overflow-auto">
          <Table className="shadow-md">
            <TableHeader className="bg-muted text-muted-foreground">
              <TableRow>
                <TableHead>Row</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Sex</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Employment</TableHead>
                <TableHead>Income</TableHead>
                <TableHead>Skills</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.slice(0, 5).map((participant, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{`${participant.firstName} ${participant.lastName}`}</TableCell>
                  <TableCell>{participant.sex}</TableCell>
                  <TableCell>{participant.age}</TableCell>
                  <TableCell>{participant.contact}</TableCell>
                  <TableCell>{participant.employmentStatus}</TableCell>
                  <TableCell>{participant.monthlyIncome} UGX</TableCell>
                  <TableCell>{participant.skillOfInterest}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
