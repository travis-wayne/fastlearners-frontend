import { Metadata } from 'next';
import { LessonViewer } from '@/components/lessons/LessonViewer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

// Helper function to format slugs into readable titles
function formatSlug(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}


export async function generateMetadata({ params }: { params: { slug: string[] } }): Promise<Metadata> {
  const { slug } = params;

  if (!slug || slug.length !== 2) {
    return {
      title: 'Invalid Lesson | Fast Learner',
      description: 'The lesson URL is invalid. Please check the link and try again.',
    };
  }

  const [subjectSlug, topicSlug] = slug;
  const subject = formatSlug(subjectSlug);
  const topic = formatSlug(topicSlug);

  return {
    title: `${subject} - ${topic} | Lesson`,
    description: `Learn about ${topic} in ${subject}. Explore concepts, examples, and exercises to master the topic.`,
  };
}

export default async function LessonPage({ params }: { params: { slug: string[] } }) {
  const { slug } = params;

  if (!slug || slug.length !== 2) {
    return (
      <div className="container mx-auto max-w-4xl p-6">
        <Card className="border-2 border-dashed">
          <CardHeader>
            <CardTitle>Invalid Lesson URL</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              The lesson URL is invalid. Please check the link and try again.
            </p>
            <Button variant="outline" asChild>
              <a href="/dashboard/lessons">Back to Lessons</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const [subjectSlug, topicSlug] = slug;
  const subject = formatSlug(subjectSlug);
  const topic = formatSlug(topicSlug);

  return (
    <div className="container mx-auto max-w-full space-y-6 p-6">
      {/* Breadcrumb Navigation */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/lessons">Lessons</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{subject}</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{topic}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Back to Lessons Button */}
      <Button variant="outline" asChild className="w-fit">
        <a href="/dashboard/lessons">Back to Lessons</a>
      </Button>

      {/* LessonViewer */}
      <LessonViewer
        subjectSlug={subjectSlug}
        topicSlug={topicSlug}
        autoLoad={true}
      />
    </div>
  );
}